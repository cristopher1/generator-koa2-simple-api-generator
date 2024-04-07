import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'
import fs from 'fs-extra'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-koa2-api-generator:docker-compose', () => {
  const baseStructureWithDatabaseService = [
    'database/.dockerignore',
    'database/.env',
    'database/.env.example',
    'database/Dockerfile',
    '.env',
    '.env.example',
    'docker-compose.yml',
  ]

  const baseStructureWithoutDatabaseService = [
    '.env',
    '.env.example',
    'docker-compose.yml',
  ]

  describe('docker compose support for database not supported', () => {
    it('Should throw an exception when the user selects a database that is not supported', async () => {
      // Arrange
      const answers = {}
      answers.useDockerCompose = true
      answers.databaseName = 'database is not supported'

      const expected = Error

      const runGenerator = async () => {
        await helpers
          .run(path.join(__dirname, '../generators/docker_compose'))
          .withAnswers(answers)
      }

      // Assert
      await expect(runGenerator).rejects.toThrow(expected)
    })
  })

  describe('add docker compose support for PostgreSQL', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDockerCompose = true
      answers.databaseName = 'postgresql'

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/docker_compose'))
        .inTmpDir((dir) => {
          fs.copySync(
            path.join(__dirname, '../generators/app/templates/api/.env'),
            path.join(dir, 'api', '.env'),
          )
        })
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructureWithDatabaseService)
    })

    describe('database folder', () => {
      describe('.env', () => {
        it('Should create a .env file with the correct environment database variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'POSTGRES_USER=admin'],
            ['database/.env', 'POSTGRES_PASSWORD=admin'],
            ['database/.env', 'POSTGRES_DB=api'],
          ])
        })
      })

      describe('.env.example', () => {
        it('Should create a .env.example file with the correct database environment variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env.example', 'POSTGRES_USER=admin'],
            ['database/.env.example', 'POSTGRES_PASSWORD=admin'],
            ['database/.env.example', 'POSTGRES_DB=api'],
          ])
        })
      })

      describe('Dockerfile', () => {
        it('Should create a Dockerfile with the correct database image', () => {
          // Assert
          assert.fileContent([['database/Dockerfile', 'FROM postgres']])
        })
      })
    })

    describe('api folder', () => {
      describe('.env', () => {
        it('Should add the respective database environment variables to .env file', () => {
          assert.fileContent([
            ['api/.env', 'DB_USERNAME=admin'],
            ['api/.env', 'DB_PASSWORD=admin'],
            ['api/.env', 'DB_NAME=api'],
            ['api/.env', 'DB_HOST=database'],
            ['api/.env', 'DB_PORT=5432'],
            [
              'api/.env',
              'DATABASE_URL=postgresql://admin:admin@database:5432/api',
            ],
          ])
        })
      })
    })

    describe('docker-compose.yml', () => {
      it('Should create a docker-compose.yml with the correct database volumes', () => {
        // Assert
        assert.fileContent([
          ['docker-compose.yml', '- pg_data:/var/lib/postgresql/data'],
          ['docker-compose.yml', 'pg_data:'],
        ])
      })
    })
  })

  describe('add docker compose support for MySQL', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDockerCompose = true
      answers.databaseName = 'mysql'

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/docker_compose'))
        .inTmpDir((dir) => {
          fs.copySync(
            path.join(__dirname, '../generators/app/templates/api/.env'),
            path.join(dir, 'api', '.env'),
          )
        })
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructureWithDatabaseService)
    })

    describe('database folder', () => {
      describe('.env', () => {
        it('Should create a .env file with the correct environment database variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MYSQL_ROOT_PASSWORD=admin'],
            ['database/.env', 'MYSQL_USER=admin'],
            ['database/.env', 'MYSQL_PASSWORD=admin'],
            ['database/.env', 'MYSQL_DATABASE=api'],
          ])
        })
      })

      describe('.env.example', () => {
        it('Should create a .env.example file with the correct database environment variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MYSQL_ROOT_PASSWORD=admin'],
            ['database/.env', 'MYSQL_USER=admin'],
            ['database/.env', 'MYSQL_PASSWORD=admin'],
            ['database/.env', 'MYSQL_DATABASE=api'],
          ])
        })
      })

      describe('Dockerfile', () => {
        it('Should create a Dockerfile with the correct database image', () => {
          // Assert
          assert.fileContent([['database/Dockerfile', 'FROM mysql']])
        })
      })
    })

    describe('api folder', () => {
      describe('.env', () => {
        it('Should add the respective database environment variables to .env file', () => {
          assert.fileContent([
            ['api/.env', 'DB_USERNAME=admin'],
            ['api/.env', 'DB_PASSWORD=admin'],
            ['api/.env', 'DB_NAME=api'],
            ['api/.env', 'DB_HOST=database'],
            ['api/.env', 'DB_PORT=3306'],
            ['api/.env', 'DATABASE_URL=mysql://admin:admin@database:3306/api'],
          ])
        })
      })
    })

    describe('docker-compose.yml', () => {
      it('Should create a docker-compose.yml with the correct database volumes', () => {
        // Assert
        assert.fileContent([
          ['docker-compose.yml', '- mysql_data:/var/lib/mysql'],
          ['docker-compose.yml', 'mysql_data:'],
        ])
      })
    })
  })

  describe('add docker compose support for MariaDB', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDockerCompose = true
      answers.databaseName = 'mariadb'

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/docker_compose'))
        .inTmpDir((dir) => {
          fs.copySync(
            path.join(__dirname, '../generators/app/templates/api/.env'),
            path.join(dir, 'api', '.env'),
          )
        })
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructureWithDatabaseService)
    })

    describe('database folder', () => {
      describe('.env', () => {
        it('Should create a .env file with the correct environment database variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MARIADB_ROOT_PASSWORD=admin'],
            ['database/.env', 'MARIADB_USER=admin'],
            ['database/.env', 'MARIADB_PASSWORD=admin'],
            ['database/.env', 'MARIADB_DATABASE=api'],
          ])
        })
      })

      describe('.env.example', () => {
        it('Should create a .env.example file with the correct database environment variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MARIADB_ROOT_PASSWORD=admin'],
            ['database/.env', 'MARIADB_USER=admin'],
            ['database/.env', 'MARIADB_PASSWORD=admin'],
            ['database/.env', 'MARIADB_DATABASE=api'],
          ])
        })
      })

      describe('Dockerfile', () => {
        it('Should create a Dockerfile with the correct database image', () => {
          // Assert
          assert.fileContent([['database/Dockerfile', 'FROM mariadb']])
        })
      })
    })

    describe('api folder', () => {
      describe('.env', () => {
        it('Should add the respective database environment variables to .env file', () => {
          assert.fileContent([
            ['api/.env', 'DB_USERNAME=admin'],
            ['api/.env', 'DB_PASSWORD=admin'],
            ['api/.env', 'DB_NAME=api'],
            ['api/.env', 'DB_HOST=database'],
            ['api/.env', 'DB_PORT=3306'],
            ['api/.env', 'DATABASE_URL=mysql://admin:admin@database:3306/api'],
          ])
        })
      })
    })

    describe('docker-compose.yml', () => {
      it('Should create a docker-compose.yml with the correct database volumes', () => {
        // Assert
        assert.fileContent([
          ['docker-compose.yml', '- maria_db_data:/var/lib/mysql'],
          ['docker-compose.yml', '- maria_db_backup:/backup'],
          ['docker-compose.yml', 'maria_db_data:'],
          ['docker-compose.yml', 'maria_db_backup:'],
        ])
      })
    })
  })

  describe('add docker compose support for MongoDB', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDockerCompose = true
      answers.databaseName = 'mongodb'

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/docker_compose'))
        .inTmpDir((dir) => {
          fs.copySync(
            path.join(__dirname, '../generators/app/templates/api/.env'),
            path.join(dir, 'api', '.env'),
          )
        })
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructureWithDatabaseService)
    })

    describe('database folder', () => {
      describe('.env', () => {
        it('Should create a .env file with the correct environment database variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MONGO_INITDB_ROOT_USERNAME=admin'],
            ['database/.env', 'MONGO_INITDB_ROOT_PASSWORD=admin'],
            ['database/.env', 'MONGO_INITDB_DATABASE=api'],
          ])
        })
      })

      describe('.env.example', () => {
        it('Should create a .env.example file with the correct database environment variables', () => {
          // Assert
          assert.fileContent([
            ['database/.env', 'MONGO_INITDB_ROOT_USERNAME=admin'],
            ['database/.env', 'MONGO_INITDB_ROOT_PASSWORD=admin'],
            ['database/.env', 'MONGO_INITDB_DATABASE=api'],
          ])
        })
      })

      describe('Dockerfile', () => {
        it('Should create a Dockerfile with the correct database image', () => {
          // Assert
          assert.fileContent([['database/Dockerfile', 'FROM mongo']])
        })
      })
    })

    describe('api folder', () => {
      describe('.env', () => {
        it('Should add the respective database environment variables to .env file', () => {
          assert.fileContent([
            ['api/.env', 'DB_USERNAME=admin'],
            ['api/.env', 'DB_PASSWORD=admin'],
            ['api/.env', 'DB_NAME=api'],
            ['api/.env', 'DB_HOST=database'],
            ['api/.env', 'DB_PORT=27017'],
            [
              'api/.env',
              'DATABASE_URL=mongodb://admin:admin@database:27017/api',
            ],
          ])
        })
      })
    })

    describe('docker-compose.yml', () => {
      it('Should create a docker-compose.yml with the correct database volumes', () => {
        // Assert
        assert.fileContent([
          ['docker-compose.yml', '- mongo_data:/etc/mongo'],
          ['docker-compose.yml', 'mongo_data:'],
        ])
      })
    })
  })

  describe('add docker compose support for Do not select any', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDockerCompose = true
      answers.databaseName = null

      /**
       * Add options to withAnswers, for example: Use a callback function to
       * trigger filter functions used in question objects.
       */
      const options = {
        /**
         * This function is called by withAnswers for each answer.
         *
         * @param {any} answer User entered answer.
         * @param {Object} param
         * @param {any} param.question The question associated with the answer.
         * @param {any} param.answers All user entered answers.
         * @returns
         */
        callback: (answer, { question, answers }) =>
          question.filter ? question.filter(answer) : answer,
      }

      await helpers
        .run(path.join(__dirname, '../generators/docker_compose'))
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructureWithoutDatabaseService)
    })

    describe('docker-compose.yml', () => {
      it('Should create a docker-compose.yml with the correct database volumes', () => {
        // Assert
        assert.noFileContent([
          [
            'docker-compose.yml',
            `database:
              build:
                context: database
              env_file:
                - database/.env
              restart: always`,
          ],
          ['docker-compose.yml', 'volumes:'],
        ])
      })
    })
  })
})
