import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'

export default class GeneratorKoa2ApiGenerator extends Generator {
  #answers
  #generatorProvider

  constructor(args, opts) {
    super(args, opts)

    this.argument('projectName', {
      type: String,
      description: 'Name of the project',
      required: true,
    })

    this.option('runGitInit', {
      type: Boolean,
      description:
        'Do you want to run git init automatically, then installing the dependencies?',
      default: false,
      required: false,
    })

    this.option('runPackageScripts', {
      type: Boolean,
      description:
        'Do you want to automatically run the scripts that configure the project, then installing the dependencies?',
      default: false,
      required: false,
    })

    this.option('useDocker', {
      type: Boolean,
      description:
        'Add docker support using DockerFile, .dockerignore and others',
      required: false,
    })

    this.option('nodeVersion', {
      type: Number,
      description:
        'Node version used in DockerFile. (FROM nodeVersion). Recommended to use node 16, 18, 20 or 21',
      required: false,
    })

    this.option('projectFolderName', {
      type: String,
      description:
        'Project folder name used in DockerFile. (WORKDIR /usr/src/projectFolderName)',
      required: false,
    })

    this.option('useDockerCompose', {
      type: Boolean,
      description: 'Add Docker Compose support.',
      required: false,
    })

    this.option('databaseName', {
      type: String,
      description: 'Select the database to which the application will connect.',
      required: false,
    })
  }

  initializing() {
    this.#generatorProvider = new GeneratorProvider()
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the glorious ${chalk.red(
          'generator-koa2-api-generator',
        )} generator!`,
      ),
    )

    const prompts = [
      {
        type: 'list',
        name: 'runGitInit',
        message:
          'Do you want to run git init automatically, then installing the dependencies?',
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        when: () => !this.options.runGitInit,
      },
      {
        type: 'list',
        name: 'runPackageScripts',
        message: `Do you want to automatically run the scripts that configure the package, then installing the dependencies?`,
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        when: () => !this.options.runPackageScripts,
      },
    ]

    const answers = await this.prompt(prompts)

    this.#answers = {
      projectName: this.options.projectName,
      runGitInit: this.options.runGitInit || answers.runGitInit || false,
      runPackageScripts:
        this.options.runPackageScripts || answers.runPackageScripts || false,
      useDocker: this.options.useDocker,
      nodeVersion: this.options.nodeVersion,
      projectFolderName: this.options.projectFolderName,
      useDockerCompose: this.options.useDockerCompose,
      databaseName: this.options.databaseName,
    }
  }

  async #addGit() {
    const generator = this.#generatorProvider.getGitGenerator()
    await this.composeWith(generator)
  }

  async #addEslint() {
    const generator = this.#generatorProvider.getEslintGenerator()
    await this.composeWith(generator)
  }

  async #addHusky() {
    const generator = this.#generatorProvider.getHuskyGenerator()
    await this.composeWith(generator)
  }

  async #addLintStaged() {
    const generator = this.#generatorProvider.getLintStagedGenerator()
    await this.composeWith(generator)
  }

  async #addPrettier() {
    const generator = this.#generatorProvider.getPrettierGenerator()
    await this.composeWith(generator)
  }

  async #addCommitLint() {
    const generator = this.#generatorProvider.getCommitLintGenerator()
    await this.composeWith(generator)
  }

  async #addDocker(options) {
    const generator = this.#generatorProvider.getDockerGenerator()
    await this.composeWith(generator, options)
  }

  async #addDockerCompose(options) {
    const generator = this.#generatorProvider.getDockerComposeGenerator()
    await this.composeWith(generator, options)
  }

  async configuring() {
    const { useDocker, nodeVersion, projectFolderName } = this.#answers
    const { useDockerCompose, databaseName } = this.#answers

    await this.#addGit()
    await this.#addEslint()
    await this.#addHusky()
    await this.#addLintStaged()
    await this.#addPrettier()
    await this.#addCommitLint()
    await this.#addDocker({
      useDocker,
      nodeVersion,
      projectFolderName,
    })
    await this.#addDockerCompose({
      useDockerCompose,
      databaseName,
    })
  }

  writing() {
    const { projectName } = this.#answers

    this.env.cwd = this.destinationPath('api')

    this.destinationRoot(this.env.cwd)

    this.fs.copy(this.templatePath('api/src'), this.destinationPath('src'))
    this.fs.copy(
      this.templatePath('api/.env.example'),
      this.destinationPath('.env.example'),
    )
    this.fs.copy(this.templatePath('api/.env'), this.destinationPath('.env'))
    this.fs.copy(
      this.templatePath('api/package.json'),
      this.destinationPath('package.json'),
    )
    this.fs.copyTpl(
      this.templatePath('api/README.md'),
      this.destinationPath('README.md'),
      {
        projectName,
      },
    )

    const packageJsonContent = {
      name: projectName,
    }

    this.packageJson.merge(packageJsonContent)
  }

  #runGitInit() {
    this.log('\n********** Run git init command **********\n')
    this.spawnSync('git', ['init'])
  }

  #getDependencyManager(dependencyManagers) {
    for (const dependencyManager of dependencyManagers) {
      this.log(`Find ${dependencyManager}`)
      const isAvailable = this.#dependencyManagerAvailable(dependencyManager)
      if (isAvailable) {
        return dependencyManager
      }
    }
  }

  #dependencyManagerAvailable(name) {
    try {
      this.spawnSync(`${name}`, ['--version'])
      return true
    } catch (err) {
      return false
    }
  }

  #runPackageScripts(dependencyManager) {
    this.log('\n********** Run scripts from package.json **********')
    const scriptArguments = [['init'], ['format:fix']]
    for (const args of scriptArguments)
      this.spawnSync(`${dependencyManager}`, ['run', ...args])
  }

  #runGoodBye() {
    this.log('\n')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('********                                    ********')
    this.log('******    Thanks for to use this generator    ******')
    this.log('****                                            ****')
    this.log('******     The project structure is ready     ******')
    this.log('********                                    ********')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('\n')
  }

  end() {
    const dependencyManagers = ['yarn', 'npm']
    const { runGitInit, runPackageScripts } = this.#answers

    if (runGitInit) {
      this.#runGitInit()
    }

    if (runPackageScripts) {
      const dependencyManager = this.#getDependencyManager(dependencyManagers)
      this.log(`using ${dependencyManager}`)

      this.#runPackageScripts(dependencyManager)
    }

    this.#runGoodBye()
  }
}
