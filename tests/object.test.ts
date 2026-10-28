import { describe, it, expect } from 'vitest'
import { pick, omit, mapValues, mapKeys, invert, merge, get, has, set, crush, construct, mapEntries } from '../src/object'

// ============================================================
// pick
// ============================================================
describe('pick', () => {
  it('只保留指定键', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('忽略不存在的键', () => {
    expect(pick({ a: 1 }, ['a', 'x' as never])).toEqual({ a: 1 })
  })

  it('不修改原对象', () => {
    const source = { a: 1, b: 2 }
    pick(source, ['a'])
    expect(source).toEqual({ a: 1, b: 2 })
  })

  it('不复制继承属性', () => {
    const source = Object.create({ inherited: 1 })
    source.own = 2
    expect(pick(source, ['inherited' as never, 'own'])).toEqual({ own: 2 })
  })
})

// ============================================================
// omit
// ============================================================
describe('omit', () => {
  it('排除指定键', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('不修改原对象', () => {
    const source = { a: 1, b: 2 }
    omit(source, ['a'])
    expect(source).toEqual({ a: 1, b: 2 })
  })
})

// ============================================================
// mapValues
// ============================================================
describe('mapValues', () => {
  it('映射每个值并保留键', () => {
    expect(mapValues({ a: 1, b: 2 }, (value) => value * 2)).toEqual({ a: 2, b: 4 })
  })

  it('映射函数可读取键', () => {
    expect(mapValues({ a: 1 }, (value, key) => `${String(key)}${value}`)).toEqual({ a: 'a1' })
  })
})

// ============================================================
// mapKeys
// ============================================================
describe('mapKeys', () => {
  it('映射每个键并保留值', () => {
    expect(mapKeys({ a: 1, b: 2 }, (_value, key) => String(key).toUpperCase())).toEqual({ A: 1, B: 2 })
  })

  it('键冲突时后者覆盖前者', () => {
    expect(mapKeys({ a: 1, b: 2 }, () => 'same')).toEqual({ same: 2 })
  })

  it('忽略 __proto__ 等危险键', () => {
    const result = mapKeys({ a: 1 }, () => '__proto__')
    expect(Object.keys(result)).toHaveLength(0)
  })
})

// ============================================================
// invert
// ============================================================
describe('invert', () => {
  it('交换键与值', () => {
    expect(invert({ a: 'x', b: 'y' })).toEqual({ x: 'a', y: 'b' })
  })

  it('数字值转为字符串键', () => {
    expect(invert({ a: 1 })).toEqual({ '1': 'a' })
  })
})

// ============================================================
// merge
// ============================================================
describe('merge', () => {
  it('深度合并嵌套对象', () => {
    const result = merge({ a: 1, nested: { b: 2 } }, { nested: { c: 3 } })
    expect(result).toEqual({ a: 1, nested: { b: 2, c: 3 } })
  })

  it('后者覆盖同名原始值', () => {
    expect(merge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
  })

  it('数组整体替换并复制，不与原数组共享引用', () => {
    const next = [3, 4]
    const result = merge({ list: [1, 2] }, { list: next })
    expect(result.list).toEqual([3, 4])
    expect(result.list).not.toBe(next)
  })

  it('不修改 target 与 sources', () => {
    const target = { nested: { a: 1 } }
    const source = { nested: { b: 2 } }
    merge(target, source)
    expect(target).toEqual({ nested: { a: 1 } })
    expect(source).toEqual({ nested: { b: 2 } })
  })

  it('忽略 __proto__ 污染键', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":true}}')
    merge({}, malicious)
    expect(({} as any).polluted).toBeUndefined()
  })
})

// ============================================================
// get
// ============================================================
describe('get', () => {
  const source = { a: { b: [{ c: 1 }] } }

  it('支持点路径', () => {
    expect(get(source, 'a.b[0].c')).toBe(1)
  })

  it('支持键数组', () => {
    expect(get(source, ['a', 'b', 0, 'c'])).toBe(1)
  })

  it('路径不存在返回默认值', () => {
    expect(get(source, 'a.x.y', 'fallback')).toBe('fallback')
  })

  it('中间值为 null 时返回默认值', () => {
    expect(get({ a: null }, 'a.b', 0)).toBe(0)
  })

  it('空路径返回默认值', () => {
    expect(get(source, '', 'fallback')).toBe('fallback')
  })

  it('值为 undefined 时返回默认值', () => {
    expect(get({ a: undefined }, 'a', 1)).toBe(1)
  })
})

// ============================================================
// has
// ============================================================
describe('has', () => {
  it('存在的嵌套路径返回 true', () => {
    expect(has({ a: { b: 1 } }, 'a.b')).toBe(true)
  })

  it('不存在的路径返回 false', () => {
    expect(has({ a: {} }, 'a.b')).toBe(false)
    expect(has({ a: null }, 'a.b')).toBe(false)
  })

  it('空路径返回 false', () => {
    expect(has({}, '')).toBe(false)
  })

  it('继承属性也视为存在', () => {
    expect(has(Object.create({ inherited: 1 }), 'inherited')).toBe(true)
  })

  it('支持数组索引路径', () => {
    expect(has({ list: [1] }, 'list[0]')).toBe(true)
    expect(has({ list: [] }, 'list[0]')).toBe(false)
  })
})

// ============================================================
// set
// ============================================================
describe('set', () => {
  it('按路径写入并返回新对象', () => {
    const source = { a: { b: 1 } }
    const result = set(source, 'a.c', 2)
    expect(result).toEqual({ a: { b: 1, c: 2 } })
    expect(source).toEqual({ a: { b: 1 } })
  })

  it('缺失层级自动创建，数字段创建数组', () => {
    expect(set({}, 'list[0].name', 'x')).toEqual({ list: [{ name: 'x' }] })
  })

  it('修改嵌套数组元素不修改原数组', () => {
    const source = { list: [{ n: 1 }, { n: 2 }] }
    const result = set(source, 'list[1].n', 9)
    expect(result).toEqual({ list: [{ n: 1 }, { n: 9 }] })
    expect(source.list[1].n).toBe(2)
  })

  it('未修改的兄弟节点保持引用', () => {
    const shared = { x: 1 }
    const source = { a: shared, b: 1 }
    expect(set(source, 'b', 2).a).toBe(shared)
  })

  it('空路径返回原对象', () => {
    const source = { a: 1 }
    expect(set(source, '', 2)).toBe(source)
  })

  it('危险路径抛出 TypeError', () => {
    expect(() => set({}, '__proto__.polluted', true)).toThrow(TypeError)
    expect(() => set({}, 'constructor.prototype.x', true)).toThrow(TypeError)
  })
})

// ============================================================
// crush
// ============================================================
describe('crush', () => {
  it('将嵌套对象压平为路径键', () => {
    expect(crush({ a: { b: 1 }, list: [{ c: 2 }], empty: {} })).toEqual({
      'a.b': 1,
      'list.0.c': 2,
      empty: {},
    })
  })

  it('支持自定义分隔符', () => {
    expect(crush({ a: { b: 1 } }, '/')).toEqual({ 'a/b': 1 })
  })

  it('空对象返回空对象', () => {
    expect(crush({})).toEqual({})
  })
})

// ============================================================
// construct
// ============================================================
describe('construct', () => {
  it('将路径键还原为嵌套结构', () => {
    expect(construct({ 'a.b': 1, 'list.0.c': 2 })).toEqual({
      a: { b: 1 },
      list: [{ c: 2 }],
    })
  })

  it('与 crush 互为逆操作', () => {
    const source = { a: { b: 1 }, list: [{ c: 2 }, { d: 3 }] }
    expect(construct(crush(source))).toEqual(source)
  })

  it('跳过危险路径', () => {
    expect(construct({ '__proto__.polluted': true })).toEqual({})
  })
})

// ============================================================
// mapEntries
// ============================================================
describe('mapEntries', () => {
  it('同时映射键与值', () => {
    expect(mapEntries({ a: 1, b: 2 }, (key, value) => [String(key).toUpperCase(), value * 2]))
      .toEqual({ A: 2, B: 4 })
  })

  it('键冲突时后者覆盖前者', () => {
    expect(mapEntries({ a: 1, b: 2 }, () => ['same', 0])).toEqual({ same: 0 })
  })

  it('空对象返回空对象', () => {
    expect(mapEntries({}, () => ['k', 'v'])).toEqual({})
  })
})
