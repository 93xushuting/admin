const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const chalk = require('chalk') // 添加颜色
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css抽取
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // css压缩
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 删除dist目录
const { VueLoaderPlugin } = require('vue-loader')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// const smp = new SpeedMeasurePlugin()
let pa = require('./package.json')
let argv = require('yargs').argv
let appName = argv._[0]
let NODE_ENV = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod' // 生产
let DEV = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' // 开发
let envFlag = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev' // b 端
if (envFlag) {
  appName = 'business'
}
console.info(chalk.cyan('=======项目名 : [ ' + JSON.stringify(appName) + ' ] \n'))
console.info(chalk.green('=======环境======  ' + process.env.NODE_ENV + '\n'))
const statics = 'static/'
const outputFileName = statics + `js/[name].[` + (NODE_ENV ? 'chunkHash' : 'hash') + `:8].js`
const outPutCss = DEV ? 'style-loader' : MiniCssExtractPlugin.loader
// const outPutCss = MiniCssExtractPlugin.loader
let htmlOpts = {
  filename: 'index.html',
  template: 'index.html', // 启动页面
  inject: true, // true或者body：所有JavaScript资源插入到body元素的底部
  showErrors: true,
  // 本地
  cdn: {
    css: [
      '//at.alicdn.com/t/font_1956644_8ql2p8kmxi9.css', // font-class引用
      '/static/libs/elementUI@2.11.1.css',
      '/static/libs/nprogress@0.2.0.css'
    ],
    js: [
      '/static/libs/polyfill@7.6.0.min.js',
      '/static/libs/vue@2.5.21.min.js',
      '/static/libs/vue-router@3.0.2.min.js',
      '/static/libs/vuex@3.0.1.min.js',
      '/static/libs/axios@0.19.0.min.js',
      '/static/libs/elementUI@2.11.1.js',
      // '/static/libs/html2canvas.min.js',
      // '/static/libs/jspdf.min.js',
      '/static/libs/nprogress@0.2.0.js',
      '/static/libs/echarts-en@4.3.0-rc.2.common.js',
      '//at.alicdn.com/t/font_1956644_8ql2p8kmxi9.js',
      '/static/libs/pdf.min.js'
    ]
  },
  title: '' // router/index.js动态添加title
}
if (envFlag) { // b 端使用 symbol引用 iconfont
  // htmlOpts.cdn.js.push('//at.alicdn.com/t/font_1956644_vuzkmxrtvwl.js')
  htmlOpts.cdn.js.push('/static/libs/calendar.js')
}
let baseConfig = {
  mode: NODE_ENV ? 'production' : 'development', // webpack4.0 新增
  entry: {
    app: envFlag ? './src_b/main.js' : './src/main.js'
  },
  output: { // 配置打包结果， path 定义了输出的文件夹，filename则定义了打包结果文件的名称
    path: path.join(__dirname, (appName ? './dist_b' : './dist')), // 输出文件的保存路径
    filename: outputFileName,
    publicPath: '/',
    chunkFilename: statics + 'js/chunk/[name].[chunkHash:8].js'
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    nprogress: 'nprogress',
    echarts: 'echarts'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', 'less'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@a': path.resolve(__dirname, './src/assets'),
      '@c': path.resolve(__dirname, './src/components'),
      '@v': path.resolve(__dirname, './src/views')
      // '@': path.resolve(__dirname, envFlag ? './src_b' : './src'),
      // '@a': path.resolve(__dirname, envFlag ? './src_b/assets' : './src/assets'),
      // '@c': path.resolve(__dirname, envFlag ? './src_b/component' : './src/components'),
      // '@v': path.resolve(__dirname, envFlag ? './src_b/view' : './src/views')
    }
  },
  stats: {
    children: false
  },
  performance: {
    hints: false, // false | 'error' | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
    maxEntrypointSize: 250000, // 首次加载文件总和超过250k，命令行告警
    maxAssetSize: 250000 // 单文件超过250k，命令行告警
  },
  module: {
    rules: [
      // 缓存
      { test: /\.(vue|js)$/, loader: 'eslint-loader', exclude: /node_modules/, enforce: 'pre' },
      { test: /\.vue$/, exclude: /node_modules/, use: ['cache-loader', 'thread-loader', 'vue-loader'] },
      { test: /\.js$/, exclude: /(node_modules|bower_components)/, use: [{ loader: 'cache-loader' }, { loader: 'thread-loader', options: { workers: 2 } }, { loader: 'babel-loader', options: { presets: ['env'] } }] },
      {
        test: /\.(le|c)ss$/,
        use: [
          DEV ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: DEV, // DEV为true时，css样式热替换
              reloadAll: true
            }
          },
          // outPutCss,
          'css-loader',
          'less-loader',
          { loader: 'postcss-loader', options: { plugins: [require('autoprefixer')('last 100 versions')] } }
        ]
      },
      // 不缓存
      // { test: /\.(vue|js)$/, loader: 'eslint-loader', exclude: /node_modules/, enforce: 'pre' },
      // { test: /\.vue$/, loader: 'vue-loader' },
      // { test: /\.js$/, exclude: /(node_modules|bower_components)/, use: { loader: 'babel-loader', options: { presets: ['env'] } } },
      // { test: /\.css$/, use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'] },
      // { test: /\.less$/, use: ['style-loader', 'css-loader', { loader: 'less-loader', options: { modules: true } }] },
      { test: /\.(png|jpe?g|gif|svg|ico|pdf)(\?.*)?$/, loader: 'url-loader?limit=8192&name=' + statics + 'image/[hash:8].[name].[ext]' },
      { test: /\.svg$|\.woff$|\.ttf$|\.eot$/, loader: 'url-loader?limit=8192&name=' + statics + 'fonts/[hash:8].[name].[ext]' },
      { test: /\.json$/, loader: 'json-loader' }// JSON
    ]
  },
  optimization: { // webpack4新增
    splitChunks: { // 可以在这里直接设置抽离代码的参数，最后将符合条件的代码打包至一个公共文件
      cacheGroups: { // 设置缓存组用来抽取满足不同规则的chunk,下面以生成common、vender为例
        // 根据不同的参数设置抽取不同条件的公共js
        common: {
          name: 'common',
          chunks: 'all',
          minSize: 1,
          minChunks: 1,
          priority: 1 // 设置匹配优先级，数字越小，优先级越低
        },
        vendor: {
          name: 'vender',
          test: /[\\/]node_modules[\\/]/, // 匹配node模块中匹配的的模块
          priority: 10, // 设置匹配优先级，数字越大，优先级越高
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    // 生成html文件
    new HtmlWebpackPlugin(htmlOpts),
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: 'main.html',
      title: '提示',
      inject: false
    }),

    new CopyWebpackPlugin([
      { from: './static/image', to: './static/image', ignore: ['.* '] },
      { from: './static/libs', to: './static/libs', ignore: ['.* '] }
    ]),
    // 定义全局常量,这对于允许开发构建和发布版本之间的不同行为非常有用。
    new webpack.DefinePlugin({
      APPNAME: JSON.stringify(appName),
      VERSION: JSON.stringify(pa.version),
      DESC: JSON.stringify(pa.description),
      NAME: JSON.stringify(pa.name),
      AUTHOR: JSON.stringify(pa.author)
    }),
    // 进度条
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    })
  ]
}
var webpackConfig = null
if (!NODE_ENV) { // 开发环境
  console.info(chalk.green('=======开发环境======' + '\n'))
  const port = envFlag ? '9090' : '8080'// 默认启动端口号
  let devTools = {
    devtool: '#eval',
    devServer: {
      hot: true,
      // open: true, // 是否自动打开浏览器
      inline: true, // 实时刷新
      // colors: true,  // 终端中输出结果为彩色
      host: '0.0.0.0',
      port: port,
      contentBase: '/',
      historyApiFallback: true,
      disableHostCheck: true, // 新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问。
      proxy: {}
    },
    plugins: [
      // // css抽取
      // new MiniCssExtractPlugin({
      //   filename: statics + 'css/[name].[contenthash].css'
      //   // chunkFilename: statics + 'css/[id].[contenthash].css',
      //   // ignoreOrder: false // Enable to remove warnings about conflicting order
      // }),
      new webpack.HotModuleReplacementPlugin() // 代码热替换
    ]
  }
  if (envFlag) { // b
    console.info(chalk.green('=======envFlag true : b端======' + envFlag))
  } else { // p
    devTools.devServer.proxy = {
      '/api/v1/admin/*': {
        target: 'https://dev.p.unijobox.com/',
        // target: 'https://tes.p.unijobox.com/',
        // target: 'https://p.unijobox.com/',
        changeOrigin: true
      },
      // 阿义本地服务
      '/api': {
        target: 'http://10.1.0.89:9000',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
  webpackConfig = merge(baseConfig, devTools)
  // module.exports = smp.wrap(webpackConfig) // package.json script start : webpack-dev-server自动启动webpack
  module.exports = webpackConfig // package.json script start : webpack-dev-server自动启动webpack
} else { // 线上环境
  console.info(chalk.red('=======线上环境======\n'))
  webpackConfig = merge(baseConfig, {
    devtool: '#source-map',
    plugins: [
      new CleanWebpackPlugin(),
      // css抽取
      new MiniCssExtractPlugin({
        filename: statics + 'css/[name].[contenthash].css'
        // chunkFilename: statics + 'css/[id].[contenthash].css',
        // ignoreOrder: false // Enable to remove warnings about conflicting order
      }),
      // css压缩
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      // new BundleAnalyzerPlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        },
        sourceMap: false
      })
    ]
  })
  // 手动启动webpack(node ./webpack.config.js)
  // var ora = require('ora')
  // var spinner = ora('=====开始编译中...')
  // spinner.start()
  // var wc = smp.wrap(webpackConfig)
  var wc = webpackConfig
  webpack(wc, function (err, stats) {
    // spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(chalk.cyan('=======编译完成.\n'))
  })
}
