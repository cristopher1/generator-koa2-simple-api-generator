import Generator from 'yeoman-generator'
import { DataProcessor } from '../lib/index.js'

export default class GeneratorDockerCompose extends Generator {
  #answers
  #databaseService = {}
  #databaseEnvironmentVariables = ''

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

    if (useDockerCompose) {
      switch (databaseName) {
        case 'mysql':
          this.#databaseService = {
            image: 'mysql',
            volumenMapped: '\n      - mysql_data:/var/lib/mysql',
            volumen: '\n  mysql_data:',
          }
          this.#databaseEnvironmentVariables =
            'MYSQL_ROOT_PASSWORD=admin\nMYSQL_USER=admin\nMYSQL_PASSWORD=admin\nMYSQL_DATABASE=api\n'
          break
        case 'mariadb':
          this.#databaseService = {
            image: 'mariadb',
            volumenMapped:
              '\n      - maria_db_data:/var/lib/mysql\n      - maria_db_backup:/backup',
            volumen: '\n  maria_db_data:\n  maria_db_backup:',
          }
          this.#databaseEnvironmentVariables =
            'MARIADB_ROOT_PASSWORD=admin\nMARIADB_USER=admin\nMARIADB_PASSWORD=admin\nMARIADB_DATABASE=api\n'
          break
        default:
          this.#databaseService = {
            image: 'postgres',
            volumenMapped: '\n      - pg_data:/var/lib/postgresql/data',
            volumen: '\n  pg_data:',
          }
          this.#databaseEnvironmentVariables =
            'POSTGRES_USER=admin\nPOSTGRES_PASSWORD=admin\nPOSTGRES_DB=api\n'
          break
      }
    }
  }

  writing() {
    const { useDockerCompose } = this.#answers

    if (useDockerCompose) {
      const databaseEnvironmentVariables = this.#databaseEnvironmentVariables
      const { image, volumenMapped, volumen } = this.#databaseService

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
          databaseImage: image,
        },
      )
      this.fs.copy(this.templatePath('.env'), this.destinationPath('.env'))
      this.fs.copy(
        this.templatePath('.env.example'),
        this.destinationPath('.env.example'),
      )
      this.fs.copyTpl(
        this.templatePath(`docker-compose.yml`),
        this.destinationPath('docker-compose.yml'),
        {
          databaseVolumenMapped: volumenMapped,
          databaseVolumen: volumen,
        },
      )
    }
  }
}
