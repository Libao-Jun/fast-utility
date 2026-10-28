import { describe, it, expect } from 'vitest'
import { generateRandomString, generateUUID, escapeHTML, unescapeHTML, stripHTML, ensurePrefix, ensureSuffix, removePrefix, removeSuffix, byteSize, maskName, splitWords, camelCase, pascalCase, snakeCase, kebabCase, removeDiacritics, escapeRegExp, renderTemplate, titleCase } from '../src/string'

// ============================================================
// generateRandomString
// ============================================================
describe('generateRandomString', () => {
  it('默认返回长度为 8 的字符串', () => {
    expect(generateRandomString()).toHaveLength(8)
  })

  it('返回指定长度的字符串', () => {
    expect(generateRandomString(16)).toHaveLength(16)
    expect(generateRandomString(4)).toHaveLength(4)
  })

  it('只包含字母和数字', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateRandomString(100)).toMatch(/^[A-Za-z0-9]+$/)
    }
  })

  it('长度为 0 时返回空字符串', () => {
    expect(generateRandomString(0)).toBe('')
  })

  it('每次调用返回不同值', () => {
    const results = new Set<string>()
    for (let i = 0; i < 20; i++) {
      results.add(generateRandomString(32))
    }
    expect(results.size).toBe(20)
  })
})

// ============================================================
// generateUUID
// ============================================================
describe('generateUUID', () => {
  it('返回 UUID v4 格式字符串', () => {
    expect(generateUUID()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    )
  })

  it('长度为 36', () => {
    expect(generateUUID()).toHaveLength(36)
  })

  it('每次调用返回不同值', () => {
    const results = new Set<string>()
    for (let i = 0; i < 100; i++) {
      results.add(generateUUID())
    }
    expect(results.size).toBe(100)
  })

  it('第 15 位始终是 4', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateUUID().charAt(14)).toBe('4')
    }
  })

  it('第 20 位是 8/9/a/b', () => {
    for (let i = 0; i < 50; i++) {
      const variant = generateUUID().charAt(19)
      expect(['8', '9', 'a', 'b']).toContain(variant)
    }
  })
})

// ============================================================
// escapeHTML
// ============================================================
describe('escapeHTML', () => {
  it('转义 & 符号', () => {
    expect(escapeHTML('a & b')).toBe('a &amp; b')
  })

  it('转义 < 符号', () => {
    expect(escapeHTML('a < b')).toBe('a &lt; b')
  })

  it('转义 > 符号', () => {
    expect(escapeHTML('a > b')).toBe('a &gt; b')
  })

  it('转义双引号', () => {
    expect(escapeHTML('a "b"')).toBe('a &quot;b&quot;')
  })

  it('转义单引号', () => {
    expect(escapeHTML("a 'b'")).toBe('a &#39;b&#39;')
  })

  it('同时转义多种字符', () => {
    expect(escapeHTML('<div class="a">&</div>')).toBe(
      '&lt;div class=&quot;a&quot;&gt;&amp;&lt;/div&gt;'
    )
  })

  it('无特殊字符时返回原字符串', () => {
    expect(escapeHTML('hello world')).toBe('hello world')
  })

  it('空字符串返回空字符串', () => {
    expect(escapeHTML('')).toBe('')
  })
})

// ============================================================
// unescapeHTML
// ============================================================
describe('unescapeHTML', () => {
  it('反转义 &amp;', () => {
    expect(unescapeHTML('a &amp; b')).toBe('a & b')
  })

  it('反转义 &lt;', () => {
    expect(unescapeHTML('a &lt; b')).toBe('a < b')
  })

  it('反转义 &gt;', () => {
    expect(unescapeHTML('a &gt; b')).toBe('a > b')
  })

  it('反转义 &quot;', () => {
    expect(unescapeHTML('a &quot;b&quot;')).toBe('a "b"')
  })

  it('反转义 &#39;', () => {
    expect(unescapeHTML("a &#39;b&#39;")).toBe("a 'b'")
  })

  it('反转义多种实体', () => {
    expect(unescapeHTML('&lt;div class=&quot;a&quot;&gt;&amp;&lt;/div&gt;')).toBe(
      '<div class="a">&</div>'
    )
  })

  it('无实体时返回原字符串', () => {
    expect(unescapeHTML('hello world')).toBe('hello world')
  })

  it('escapeHTML 与 unescapeHTML 可逆', () => {
    const original = '<script>alert("xss & attack")</script>'
    expect(unescapeHTML(escapeHTML(original))).toBe(original)
  })
})

// ============================================================
// stripHTML
// ============================================================
describe('stripHTML', () => {
  it('去除简单标签', () => {
    expect(stripHTML('<p>hello</p>')).toBe('hello')
  })

  it('去除嵌套标签', () => {
    expect(stripHTML('<div><span>text</span></div>')).toBe('text')
  })

  it('去除带属性的标签', () => {
    expect(stripHTML('<a href="url">link</a>')).toBe('link')
  })

  it('无标签时返回原字符串', () => {
    expect(stripHTML('plain text')).toBe('plain text')
  })

  it('空字符串返回空字符串', () => {
    expect(stripHTML('')).toBe('')
  })

  it('去除自闭合标签', () => {
    expect(stripHTML('hello<br/>world')).toBe('helloworld')
    expect(stripHTML('hello<img src="x" />world')).toBe('helloworld')
  })
})

// ============================================================
// ensurePrefix
// ============================================================
describe('ensurePrefix', () => {
  it('没有前缀时添加前缀', () => {
    expect(ensurePrefix('world', 'hello-')).toBe('hello-world')
  })

  it('已有前缀时不重复添加', () => {
    expect(ensurePrefix('hello-world', 'hello-')).toBe('hello-world')
  })

  it('空字符串加前缀', () => {
    expect(ensurePrefix('', 'pre')).toBe('pre')
  })

  it('空前缀不改变原字符串', () => {
    expect(ensurePrefix('abc', '')).toBe('abc')
  })
})

// ============================================================
// ensureSuffix
// ============================================================
describe('ensureSuffix', () => {
  it('没有后缀时添加后缀', () => {
    expect(ensureSuffix('hello', '.txt')).toBe('hello.txt')
  })

  it('已有后缀时不重复添加', () => {
    expect(ensureSuffix('hello.txt', '.txt')).toBe('hello.txt')
  })

  it('空字符串加后缀', () => {
    expect(ensureSuffix('', '.js')).toBe('.js')
  })

  it('空后缀不改变原字符串', () => {
    expect(ensureSuffix('abc', '')).toBe('abc')
  })
})

// ============================================================
// removePrefix
// ============================================================
describe('removePrefix', () => {
  it('存在前缀时移除', () => {
    expect(removePrefix('hello-world', 'hello-')).toBe('world')
  })

  it('不存在前缀时返回原字符串', () => {
    expect(removePrefix('world', 'hello-')).toBe('world')
  })

  it('部分匹配的前缀也可移除', () => {
    expect(removePrefix('hello', 'he')).toBe('llo')
  })

  it('空前缀返回原字符串', () => {
    expect(removePrefix('abc', '')).toBe('abc')
  })

  it('空字符串处理', () => {
    expect(removePrefix('', 'pre')).toBe('')
  })
})

// ============================================================
// removeSuffix
// ============================================================
describe('removeSuffix', () => {
  it('存在后缀时移除', () => {
    expect(removeSuffix('hello.txt', '.txt')).toBe('hello')
  })

  it('不存在后缀时返回原字符串', () => {
    expect(removeSuffix('hello', '.txt')).toBe('hello')
  })

  it('空后缀返回原字符串', () => {
    expect(removeSuffix('abc', '')).toBe('abc')
  })

  it('空字符串处理', () => {
    expect(removeSuffix('', '.js')).toBe('')
  })
})

// ============================================================
// byteSize
// ============================================================
describe('byteSize', () => {
  it('英文字符每个占 1 字节', () => {
    expect(byteSize('hello')).toBe(5)
  })

  it('中文字符每个占 3 字节', () => {
    expect(byteSize('你好')).toBe(6)
  })

  it('中英文混合', () => {
    expect(byteSize('hello你好')).toBe(11)
  })

  it('空字符串返回 0', () => {
    expect(byteSize('')).toBe(0)
  })

  it('emoji 占多个字节', () => {
    expect(byteSize('😀')).toBe(4)
  })

  it('数字和符号各占 1 字节', () => {
    expect(byteSize('123')).toBe(3)
    expect(byteSize('!@#')).toBe(3)
  })
})

// ============================================================
// maskName
// ============================================================
describe('maskName', () => {
  it('两字姓名脱敏', () => {
    expect(maskName('张三')).toBe('张*')
  })

  it('三字姓名脱敏', () => {
    expect(maskName('张三丰')).toBe('张**')
  })

  it('四字姓名脱敏', () => {
    expect(maskName('欧阳娜娜')).toBe('欧***')
  })

  it('单字姓名原样返回', () => {
    expect(maskName('张')).toBe('张')
  })

  it('空字符串返回空字符串', () => {
    expect(maskName('')).toBe('')
  })

  it('纯空格返回空字符串', () => {
    expect(maskName('   ')).toBe('')
  })

  it('null 返回空字符串', () => {
    expect(maskName(null)).toBe('')
  })

  it('undefined 返回空字符串', () => {
    expect(maskName(undefined)).toBe('')
  })

  it('英文名脱敏', () => {
    expect(maskName('John')).toBe('J***')
  })

  it('数字类型转为字符串后脱敏', () => {
    expect(maskName(123)).toBe('1**')
  })
})

// ============================================================
// splitWords
// ============================================================
describe('splitWords', () => {
  it('按常见分隔符拆分', () => {
    expect(splitWords('fooBar baz-qux_quux2')).toEqual(['foo', 'Bar', 'baz', 'qux', 'quux', '2'])
  })

  it('拆分连续大写缩写', () => {
    expect(splitWords('XMLHttpRequest')).toEqual(['XML', 'Http', 'Request'])
  })

  it('空字符串返回空数组', () => {
    expect(splitWords('')).toEqual([])
  })
})

// ============================================================
// case conversions
// ============================================================
describe('camelCase', () => {
  it('转换空格、下划线、短横线与驼峰输入', () => {
    expect(camelCase('foo bar')).toBe('fooBar')
    expect(camelCase('foo_bar')).toBe('fooBar')
    expect(camelCase('foo-bar')).toBe('fooBar')
    expect(camelCase('FooBar')).toBe('fooBar')
  })
})

describe('pascalCase', () => {
  it('每个单词首字母大写并拼接', () => {
    expect(pascalCase('foo bar')).toBe('FooBar')
    expect(pascalCase('foo_bar-baz')).toBe('FooBarBaz')
  })
})

describe('snakeCase', () => {
  it('转换为下划线命名', () => {
    expect(snakeCase('fooBar baz')).toBe('foo_bar_baz')
  })
})

describe('kebabCase', () => {
  it('转换为短横线命名', () => {
    expect(kebabCase('fooBar_baz')).toBe('foo-bar-baz')
  })
})

// ============================================================
// removeDiacritics
// ============================================================
describe('removeDiacritics', () => {
  it('去除拉丁变音符号', () => {
    expect(removeDiacritics('café naïve')).toBe('cafe naive')
  })

  it('不改变普通文本', () => {
    expect(removeDiacritics('hello 你好')).toBe('hello 你好')
  })
})

// ============================================================
// escapeRegExp
// ============================================================
describe('escapeRegExp', () => {
  it('转义正则元字符', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c')
  })

  it('转义后可安全匹配字面量', () => {
    const pattern = new RegExp(escapeRegExp('a.b*c'))
    expect(pattern.test('a.b*c')).toBe(true)
    expect(pattern.test('axbbc')).toBe(false)
  })
})

// ============================================================
// renderTemplate
// ============================================================
describe('renderTemplate', () => {
  it('替换默认 {{key}} 占位符', () => {
    expect(renderTemplate('Hello, {{name}}!', { name: 'Ray' })).toBe('Hello, Ray!')
  })

  it('支持占位符内空白', () => {
    expect(renderTemplate('{{ name }}', { name: 'Ray' })).toBe('Ray')
  })

  it('缺失或空值替换为空字符串', () => {
    expect(renderTemplate('a{{missing}}b', {})).toBe('ab')
    expect(renderTemplate('a{{value}}b', { value: null })).toBe('ab')
  })

  it('数值与布尔值转为字符串', () => {
    expect(renderTemplate('{{n}}-{{b}}', { n: 1, b: false })).toBe('1-false')
  })

  it('支持自定义模式', () => {
    expect(renderTemplate('Hello, <name>', { name: 'Ray' }, /<(.+?)>/g)).toBe('Hello, Ray')
  })
})

// ============================================================
// titleCase
// ============================================================
describe('titleCase', () => {
  it('按空格分隔并大写每个单词首字母', () => {
    expect(titleCase('foo_bar baz-qux')).toBe('Foo Bar Baz Qux')
  })

  it('拆分 camelCase', () => {
    expect(titleCase('fooBarBaz')).toBe('Foo Bar Baz')
  })

  it('统一其余字母为小写', () => {
    expect(titleCase('FOO BAR')).toBe('Foo Bar')
  })

  it('空字符串返回空字符串', () => {
    expect(titleCase('')).toBe('')
  })
})
