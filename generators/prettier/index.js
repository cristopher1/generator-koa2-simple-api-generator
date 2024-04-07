import Generator from 'yeoman-generator'

export default class GeneratorEslint extends Generator {
  writing() {
    this.env.cwd = this.destinationPath('api')

    this.destinationRoot(this.env.cwd)

    this.fs.copy(
      this.templatePath('api/.prettierignore'),
      this.destinationPath('.prettierignore'),
    )
    this.fs.copy(
      this.templatePath('api/.prettierrc.json'),
      this.destinationPath('.prettierrc.json'),
    )
  }
}
