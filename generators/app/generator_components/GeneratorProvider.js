import GeneratorBabel from '../../babel/index.js'
import GeneratorEslint from '../../eslint/index.js'
import GeneratorGit from '../../git/index.js'
import GeneratorHusky from '../../husky/index.js'
import GeneratorLintStaged from '../../lintstaged/index.js'
import GeneratorPrettier from '../../prettier/index.js'
import GeneratorCommitLint from '../../commitlint/index.js'
import GeneratorOpenApi from '../../openapi/index.js'
import GeneratorSwagger from '../../swagger/index.js'
import GeneratorSequelize from '../../sequelize/index.js'
import GeneratorDocker from '../../docker/index.js'
import GeneratorDockerCompose from '../../docker_compose/index.js'
import GeneratorJsonSchemas from '../../json_schemas/index.js'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export class GeneratorProvider {
  getGitGenerator() {
    return {
      Generator: GeneratorGit,
      path: require.resolve('../../git'),
    }
  }

  getHuskyGenerator() {
    return {
      Generator: GeneratorHusky,
      path: require.resolve('../../husky'),
    }
  }

  getEslintGenerator() {
    return {
      Generator: GeneratorEslint,
      path: require.resolve('../../eslint'),
    }
  }

  getPrettierGenerator() {
    return {
      Generator: GeneratorPrettier,
      path: require.resolve('../../prettier'),
    }
  }

  getLintStagedGenerator() {
    return {
      Generator: GeneratorLintStaged,
      path: require.resolve('../../lintstaged'),
    }
  }

  getBabelGenerator() {
    return {
      Generator: GeneratorBabel,
      path: require.resolve('../../babel'),
    }
  }

  getCommitLintGenerator() {
    return {
      Generator: GeneratorCommitLint,
      path: require.resolve('../../commitlint'),
    }
  }

  getOpenApiGenerator() {
    return {
      Generator: GeneratorOpenApi,
      path: require.resolve('../../openapi'),
    }
  }

  getSwaggerGenerator() {
    return {
      Generator: GeneratorSwagger,
      path: require.resolve('../../swagger'),
    }
  }

  getSequelizeGenerator() {
    return {
      Generator: GeneratorSequelize,
      path: require.resolve('../../sequelize'),
    }
  }

  getDockerGenerator() {
    return {
      Generator: GeneratorDocker,
      path: require.resolve('../../docker'),
    }
  }

  getDockerComposeGenerator() {
    return {
      Generator: GeneratorDockerCompose,
      path: require.resolve('../../docker_compose'),
    }
  }

  getJsonSchemasGenerator() {
    return {
      Generator: GeneratorJsonSchemas,
      path: require.resolve('../../json_schemas'),
    }
  }
}
