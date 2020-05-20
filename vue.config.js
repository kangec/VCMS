const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8083',
                // ws: true,
                changeOrigin: true,
                //pathRewrite: {
                //    '^/api': ''
                // }
            }
        }
    },
    chainWebpack: config => {
        config.module
            .rule('svg')
            .uses.clear()
        config.module
            .rule('svg1')
            .test(/\.svg$/)
            .use('svg-sprite')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
            .include
            .add(resolve('src/icons'))
            .end()
    }
}
