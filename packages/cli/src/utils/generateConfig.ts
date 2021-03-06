import * as path from 'path'
import defaultsdeep from 'lodash.defaultsdeep'
import { findExistSync, logger } from '@ftbjs/shared'
import { validateSchema, options } from './options'
import { Options, BasePathConfig } from '../interface'

const cwd = process.cwd()

const baseConfig: BasePathConfig = {
  entry: `${cwd}/src/index.js`,
  template: `${cwd}/public/index.html`,
  favicon: `${cwd}/public/favicon.ico`,
  context: cwd
}

const defaultOptions = options()

const CustomConfiguration = (): Options => require(path.resolve(baseConfig.context, 'ftb.config.js'))

export function generateConfig() {
  if (findExistSync(baseConfig.context, 'ftb.config.js')) {
    const { value, error } = validateSchema(CustomConfiguration())

    if (error !== undefined) {
      logger.red(
        `Finding the wrong configuration in ${logger.yellow.raw('ftb.config.js')} --> ${logger.yellow.raw(
          error.details[0].message
        )}`
      )
      process.exit(0)
    }

    return defaultsdeep(value, { ...defaultOptions, ...baseConfig })
  }
  return defaultsdeep({ ...defaultOptions, ...baseConfig })
}
