import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { faker } from './helpers'
import { beforeAll } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-koa2-api-generator:docker', () => {
  const baseStructure = [
    'api/.dockerignore',
    'api/docker-entrypoint.sh',
    'api/Dockerfile',
    'api/wait-for-it.sh',
  ]

  describe('add docker support for node 16', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDocker = true
      answers.nodeVersion = 16
      answers.projectFolderName =
        faker.string.alpha() + ' ' + faker.string.alpha()

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
        .run(path.join(__dirname, '../generators/docker'))
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('Docker', () => {
      it('Should create a Dockerfile with node 16 version', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `FROM node:${answers.nodeVersion} AS base`],
        ])
      })
      it('Should create a Dockerfile with the correct WORKDIR', () => {
        // Arrage
        const formattedProjectFolderName = answers.projectFolderName.replace(
          ' ',
          '_',
        )

        // Assert
        assert.fileContent([
          ['api/Dockerfile', `WORKDIR /usr/src/${formattedProjectFolderName}`],
        ])
      })
    })
  })

  describe('add docker support for node 18', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDocker = true
      answers.nodeVersion = 18
      answers.projectFolderName = faker.string.sample()

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
        .run(path.join(__dirname, '../generators/docker'))
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('Docker', () => {
      it('Should create a Dockerfile with node 18 version', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `FROM node:${answers.nodeVersion} AS base`],
        ])
      })
      it('Should create a Dockerfile with the correct WORKDIR', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `WORKDIR /usr/src/${answers.projectFolderName}`],
        ])
      })
    })
  })

  describe('add docker support for node 20', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDocker = true
      answers.nodeVersion = 20
      answers.projectFolderName =
        faker.string.alpha() + ' ' + faker.string.alpha()

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
        .run(path.join(__dirname, '../generators/docker'))
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('Docker', () => {
      it('Should create a Dockerfile with node 20 version', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `FROM node:${answers.nodeVersion} AS base`],
        ])
      })
      it('Should create a Dockerfile with the correct WORKDIR', () => {
        // Arrage
        const formattedProjectFolderName = answers.projectFolderName.replace(
          ' ',
          '_',
        )

        // Assert
        assert.fileContent([
          ['api/Dockerfile', `WORKDIR /usr/src/${formattedProjectFolderName}`],
        ])
      })
    })
  })

  describe('add docker support for node 21', () => {
    const answers = {}

    beforeAll(async () => {
      answers.useDocker = true
      answers.nodeVersion = 21
      answers.projectFolderName = faker.string.sample()

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
        .run(path.join(__dirname, '../generators/docker'))
        .withAnswers(answers, options)
    })

    it('Should create the correct base structure', () => {
      // Assert
      assert.file(baseStructure)
    })

    describe('Docker', () => {
      it('Should create a Dockerfile with node 21 version', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `FROM node:${answers.nodeVersion} AS base`],
        ])
      })
      it('Should create a Dockerfile with the correct WORKDIR', () => {
        // Assert
        assert.fileContent([
          ['api/Dockerfile', `WORKDIR /usr/src/${answers.projectFolderName}`],
        ])
      })
    })
  })
})
