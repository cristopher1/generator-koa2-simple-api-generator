import Generator from 'yeoman-generator'
import { DataProcessor } from '../lib/index.js'
import {
  databaseConfigurations,
  DatabaseUrl,
} from './generator_components/database_configuration/index.js'
import { databaseServiceConfigurations } from './generator_components/database_service_configuration/index.js'

export default class GeneratorDockerCompose extends Generator {
  #answers
  #databaseConfiguration
  #databaseService

  constructor(args, opts) {
    super(args, opts)

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

  async prompting() {
    const prompts = [
      {
        type: 'list',
        name: 'useDockerCompose',
        message: 'Add Docker Compose support.',
        when: () => !this.options.useDockerCompose,
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
        type: 'list',
        name: 'databaseName',
        message: 'Select the database to which the application will connect.',
        when: (answers) =>
          (this.options.useDockerCompose || answers.useDockerCompose) &&
          !this.options.databaseName,
        choices: [
          {
            name: 'MySQL',
            value: 'mysql',
          },
          {
            name: 'PostgreSQL',
            value: 'postgresql',
          },
          {
            name: 'MariaDB',
            value: 'mariadb',
          },
          {
            name: 'MongoDB',
            value: 'mongodb',
          },
          {
            name: 'Do not select any',
            value: null,
          },
        ],
        default: 'postgresql',
      },
    ]

    const answers = await this.prompt(prompts)

    const databaseName = this.options.databaseName || answers.databaseName

    this.#answers = {
      useDockerCompose:
        this.options.useDockerCompose || answers.useDockerCompose,
      databaseName: DataProcessor.filterDatabaseName(databaseName),
    }
  }

  configuring() {
    const { useDockerCompose, databaseName } = this.#answers

    if (useDockerCompose && databaseName) {
      this.#databaseConfiguration = databaseConfigurations[databaseName]
      this.#databaseService = databaseServiceConfigurations[databaseName]
    }
  }

  writing() {
    const { useDockerCompose, databaseName } = this.#answers

    if (useDockerCompose) {
      this.fs.copy(this.templatePath('.env'), this.destinationPath('.env'))
      this.fs.copy(
        this.templatePath('.env.example'),
        this.destinationPath('.env.example'),
      )

      if (!databaseName) {
        this.fs.copy(
          this.templatePath('docker-compose.without-database-service.yml'),
          this.destinationPath('docker-compose.yml'),
        )
      } else {
        const dbPort = this.#databaseConfiguration.getPort()
        const dbUsername = this.#databaseConfiguration.getUsername()
        const dbPassword = this.#databaseConfiguration.getPassword()
        const dbMyDatabase = this.#databaseConfiguration.getMyDatabase()

        const databaseDockerImage = this.#databaseService.getDockerImage()
        const databaseVolumen = this.#databaseService.getVolumen()
        const databaseVolumenMapped = this.#databaseService.getVolumenMapped()
        const databaseEnvironmentVariables =
          this.#databaseService.getDatabaseEnvironmentVariables()

        const databaseUrl = DatabaseUrl.getDatabaseUrlWithoutArguments(
          this.#databaseConfiguration,
        )

        this.fs.copy(
          this.templatePath('database/.dockerignore'),
          this.destinationPath('database/.dockerignore'),
        )
        this.fs.copyTpl(
          this.templatePath('database/.env'),
          this.destinationPath('database/.env'),
          {
            environmentVariables: databaseEnvironmentVariables,
          },
        )
        this.fs.copyTpl(
          this.templatePath('database/.env.example'),
          this.destinationPath('database/.env.example'),
          {
            environmentVariables: databaseEnvironmentVariables,
          },
        )
        this.fs.copyTpl(
          this.templatePath('database/Dockerfile'),
          this.destinationPath('database/Dockerfile'),
          {
            databaseImage: databaseDockerImage,
          },
        )
        this.fs.copyTpl(
          this.templatePath(`docker-compose.with-database-service.yml`),
          this.destinationPath('docker-compose.yml'),
          {
            databaseVolumenMapped,
            databaseVolumen,
          },
        )

        const databaseEnvVariablesForApi = [
          {
            name: 'DB_USERNAME',
            value: `${dbUsername}`,
          },
          {
            name: 'DB_PASSWORD',
            value: `${dbPassword}`,
          },
          {
            name: 'DB_NAME',
            value: `${dbMyDatabase}`,
          },
          {
            name: 'DB_HOST',
            value: 'database',
          },
          {
            name: 'DB_PORT',
            value: `${dbPort}`,
          },
        ]

        let envFile = this.fs.read(this.destinationPath('api/.env'))

        for (const databaseEnvVariableForApi of databaseEnvVariablesForApi) {
          const name = databaseEnvVariableForApi.name
          const value = databaseEnvVariableForApi.value

          envFile = envFile.replace(`${name}=`, `${name}=${value}`)
        }

        envFile = envFile.replace(
          'DATABASE_URL=',
          `DATABASE_URL=${databaseUrl}`,
        )

        this.fs.write(this.destinationPath('api/.env'), envFile)
      }
    }
  }
}
