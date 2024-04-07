export default class Formatter {
  static replaceSpace(word, replacer = '_') {
    const components = word.split(' ')
    return components.join(replacer)
  }
}
