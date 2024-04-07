import Generator from 'yeoman-generator'
import Formatter from './generator_components/Formatter.js'

export default class GeneratorDocker extends Generator {
  #answers

  constructor(args, opts) {
    super(args, opts)

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
  }

  async prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'useDocker',
        message:
          'Do you want to use docker support? (Dockerfile, .dockerignore and others)',
        when: () => !this.options.useDocker,
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
      },
      {
        type: 'input',
        name: 'nodeVersion',
        message:
          'Select node version to docker image. (FROM nodeVersion). Recommended to use node 16, 18, 20 or 21',
        when: (answers) =>
          (this.options.useDocker || answers.useDocker) &&
          !this.options.nodeVersion,
      },
      {
        type: 'input',
        name: 'projectFolderName',
        message:
          'Project folder name used in DockerFile. (WORKDIR /usr/src/projectFolderName)',
        default: this.appname,
        when: (answers) =>
          (this.options.useDocker || answers.useDocker) &&
          !this.options.projectFolderName,
        filter: (input) => Formatter.replaceSpace(input),
      },
    ]

    const answers = await this.prompt(prompts)

    this.#answers = {
      useDocker: this.options.useDocker || answers.useDocker || false,
      nodeVersion: this.options.nodeVersion || answers.nodeVersion || 16,
      projectFolderName:
        this.options.projectFolderName || answers.projectFolderName || 'api',
    }
  }

  writing() {
    this.env.cwd = this.destinationPath('api')

    this.destinationRoot(this.env.cwd)

    if (this.#answers.useDocker) {
      const { nodeVersion, projectFolderName } = this.#answers

      this.fs.copyTpl(
        this.templatePath('api/Dockerfile'),
        this.destinationPath('Dockerfile'),
        {
          nodeVersion,
          projectFolderName,
        },
      )
      this.fs.copy(
        this.templatePath('api/docker-entrypoint.sh'),
        this.destinationPath('docker-entrypoint.sh'),
      )
      this.fs.copy(
        this.templatePath('api/wait-for-it.sh'),
        this.destinationPath('wait-for-it.sh'),
      )
      this.fs.copy(
        this.templatePath('api/.dockerignore'),
        this.destinationPath('.dockerignore'),
      )
    }
  }
}
