import { createSchema, validate } from '@ftbjs/shared'
import { Options, ValidateSchema } from '../interface'

const schema = createSchema(joi =>
  joi.object({
    publicPath: joi.string().allow(''),
    outputDir: joi.string(),
    assetsDir: joi.string(),
    indexPath: joi.string(),
    devServer: joi.object(),
    platform: joi.string(),
    chainWebpack: joi.func(),
    packages: joi.boolean(),
    externals: joi.object()
  })
)

export function validateSchema(options: Options): ValidateSchema {
  return validate(options, schema)
}

export function options(): Options {
  return {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    devServer: {},
    platform: 'none'
  }
}
