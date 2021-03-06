import webpack from 'webpack'
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer'
import { logger, boxen } from '@ftbjs/shared'
import { prod } from './config/prod'
import { deleteOldFolder } from './utils/deleteOldFolder'
import { checkVersion } from './utils/checkVersion'

export default function build(service, options) {
  process.env.NODE_ENV = 'production'

  deleteOldFolder(service)
  prod(service)

  options &&
    service.chainWebpack(config => {
      config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin.BundleAnalyzerPlugin, [
        {
          analyzerPort: 1703,
          analyzerMode: 'static'
        }
      ])
    })

  // Ensure high priority for user-defined webpack configurations
  service.init()

  if (!service.validEntry()) {
    logger.red(`${logger.yellow.raw('Warning: ')}Couldn\'t find the entry file index.js in src directory.`)
    process.exit(0)
  }

  webpack(service.resolveWebpackConfig(), async (err, stats) => {
    if (err) {
      throw err
    }

    if (stats.hasErrors()) {
      logger.red(`Project got build error. ${stats.toString()}`)
    }

    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    )

    const status = await checkVersion()
    if (status) {
      const msg = []
      msg.push(logger.yellow.raw('A new ftbjs cli version was found:\n\n'))
      msg.push(logger.blackBright.raw(`Please run ${logger.green.raw('npm i @ftbjs/service@latest -g')}\n\n`))
      msg.push(
        logger.blackBright.raw(
          `If you use yarn, you can run ${logger.green.raw('yarn add @ftbjs/service@latest -g')}\n\n`
        )
      )
      msg.push(logger.blackBright.raw('Experience the latest features'))
      console.log(boxen(msg.join(''), { padding: 1, borderColor: 'green' }))
    }
  })
}
