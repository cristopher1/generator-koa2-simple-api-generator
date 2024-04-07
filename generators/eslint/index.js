import Generator from 'yeoman-generator'

export default class GeneratorEslint extends Generator {
  writing() {
    this.env.cwd = this.destinationPath('api')

    this.destinationRoot(this.env.cwd)

    this.fs.copy(
      this.templatePath('api/.eslintignore'),
      this.destinationPath('.eslintignore'),
    )
    this.fs.copy(
      this.templatePath('api/.eslintrc.yml'),
      this.destinationPath('.eslintrc.yml'),
    )
  }
}
