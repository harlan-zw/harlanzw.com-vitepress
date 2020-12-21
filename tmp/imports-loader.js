const globby = require('globby')
const fs = require('fs')
const path = require('path')
const first = require('lodash/first')
const filter = require('lodash/filter')

module.exports = async function loader (source) {
  // only run for the non-query requests
  if (this.resourceQuery) {
    return source
  }

  // a. Scan components
  const base = './src/components/'
  const fileComponents = (await globby('*.vue', { cwd: base })).map(c => {
    const name = path.parse(c).name
    const shortPath = path.resolve(base).replace(path.resolve('./src'), './')
    return {
      name: name,
      import: `import ${name} from "${shortPath}/${c}"`
    }
  })

  // b. Find the template tags
  const compiler = require('@vue/compiler-sfc')
  const parsed = compiler.parse(fs.readFileSync(this.context + '/' + path.basename(this.resourcePath), 'utf8')).descriptor
  const template = compiler.compileTemplate({
    id: 'na',
    source: parsed.template.content,
    filename: this.resourcePath,
  })
  const componentTags = template.ast.components

  // c. Match making
  const matches = []
  componentTags.forEach(tag => matches.push(first(filter(fileComponents, c => c.name === tag))))

  // d. Insert the new dynamic imports
  if (!matches.length) {
    return source
  }
  const newContent = `
${matches.map(c => c.import).join('\\n')}
script.components = Object.assign({ ${matches.map(c => c.name).join(', ')} }, script.components);
`;
  return source + newContent
}