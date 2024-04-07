import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { faker } from './helpers'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-koa2-api-generator:app', () => {
  const baseStructure = [
    'api/.husky/commit-msg',
    'api/.husky/pre-commit',
    'api/.husky/pre-push',
    'api/src/config/database.js',
    'api/src/config/jwt.js',
    'api/src/routes/authentication/authenticationRouter.js',
    'api/src/routes/authentication/tokenRouter.js',
    'api/src/routes/user/registerRouter.js',
    'api/src/routes/user/router.js',
    'api/src/routes/index.js',
    'api/src/api.js',
    'api/src/server.js',
    'api/.env',
    'api/.env.example',
    'api/.eslintignore',
    'api/.eslintrc.yml',
    'api/.gitignore',
    'api/.lintstagedrc.json',
    'api/.prettierignore',
    'api/.prettierrc.json',
    'api/commitlint.config.js',
    'api/package.json',
    'api/README.md',
  ]

  describe('create a new project with a database drivers that is not supported', () => {
    it('Should throw an exception when the user selects a database that is not supported', async () => {
      // Arrange
      const answers = {}
      answers.useDockerCompose = true
      answers.databaseDriver = 'database is not supported'
      answers.runGitInit = false
      answers.runPackageScripts = false

      const expected = Error

      const runGenerator = async () => {
        await helpers
          .run(path.join(__dirname, '../generators/app'))
          .withAnswers(answers)
      }

      // Assert
      await expect(runGenerator).rejects.toThrow(expected)
    })
  })

  describe('create a new project without database drivers', () => {
    const projectName = 0
    const args = []
    const answers = {}
    const options = {
      'skip-install': true,
    }

    beforeAll(async () => {
      args[projectName] = faker.string.sample()

      answers.databaseDriver = null
      answers.runGitInit = false
      answers.runPackageScripts = false
      answers.useDocker = false
      answers.useDockerCompose = false

      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withArguments(args)
        .withAnswers(answers)
        .withOptions(options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('package.json', () => {
      it('Should create a package.json adding the required fields', () => {
        // Assert
        assert.JSONFileContent('api/package.json', {
          name: args[projectName],
          version: '0.1.0',
          main: 'index.js',
          type: 'module',
          scripts: {
            'init:husky': 'husky install',
            init: 'npm run init:husky',
            dev: 'nodemon -r dotenv/config src/server.js',
            start: 'node src/server.js',
            format: 'prettier --check .',
            'format:fix': 'prettier --write .',
            lint: 'eslint -c .eslintrc.yml --no-eslintrc --ext .js,.mjs .',
            'lint-fix': 'npm run lint -- --fix',
            test: 'echo The test is not implemented && exit -1',
            'lint-staged': 'npx lint-staged',
            commitlint: 'npx commitlint --edit',
            'quality-check': 'npm run format && npm run lint',
          },
          devDependencies: {
            '@commitlint/cli': '^18.4.4',
            '@commitlint/config-conventional': '^18.4.4',
            '@types/koa-router': '^7.4.8',
            dotenv: '^16.3.1',
            eslint: '^8.56.0',
            'eslint-config-prettier': '^9.1.0',
            'eslint-config-standard': '^17.1.0',
            'eslint-plugin-import': '^2.29.1',
            'eslint-plugin-n': '^16.6.2',
            'eslint-plugin-promise': '^6.1.1',
            husky: '^8.0.3',
            'lint-staged': '^15.2.0',
            nodemon: '^3.1.0',
            prettier: '^3.2.2',
            'prettier-plugin-jsdoc': '^1.3.0',
          },
          dependencies: {
            jsonwebtoken: '^9.0.2',
            koa: '^2.13.0',
            'koa-bearer-token': '^1.0.0',
            'koa-body': '^4.2.0',
            'koa-logger': '^3.2.1',
            'koa-override-method': '^1.0.0',
            'koa-router': '^12.0.1',
          },
        })
      })
    })

    describe('README.md', () => {
      it('Should generate the README.md file with the correct content', () => {
        // Assert
        assert.fileContent([
          [
            'api/README.md',
            `<h1 align="center">Welcome to ${args[projectName]} API 👋</h1>`,
          ],
        ])
      })
    })
  })
})
