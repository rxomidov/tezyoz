// ref: https://umijs.org/config/
import {resolve} from "path";

export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {path: '/', component: '../pages/index'},
        {path: '/sinov', component: '../pages/fast-type'},
        {path: '/musobaqa', component: '../pages/tournament'},
        {path: '/musobaqa/:id', component: '../pages/tournament/$id'},
        {path: '/online', component: '../pages/online'},
        {path: '/settings', component: '../pages/settings'},
        {path: '/history', component: '../pages/history'},
        {path: '/signup', component: '../pages/signup'},
        {path: '/signin', component: '../pages/signin'},
        {path: '/help', component: '../pages/help',},
        // {path: '/result/:id', component: '../pages/result/$id'},
        {
          path: '/admin',
          routes: [
            {path: '/admin/', component: '../pages/admin'},
            {path: '/admin/text', component: '../pages/admin/text'},
            {path: '/admin/users', component: '../pages/admin/users'},
            {path: '/admin/tournaments', component: '../pages/admin/turnir'},
          ],
          Routes: ['/src/routes/privateRoute']
        },
        {component: '../pages/404'}
      ]
    }
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: {webpackChunkName: true},
      title: 'tezyoz.uz',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    "/api": {
      "target": "https://topp.uz/",
      "changeOrigin": true,
      pathRewrite: {
        '^/api/': '/api/'
      },
    },
    "/upload": {
      "target": "https://topp.uz/",
      "changeOrigin": true,
      pathRewrite: {
        '^/api/': '/api/'
      },
    }
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    utils: resolve(__dirname, "./src/utils"),
    services: resolve(__dirname, "./src/services"),
    components: resolve(__dirname, "./src/components"),
    config: resolve(__dirname, "./src/utils/config"),
    model: resolve(__dirname, "./src/utils/model"),
    constant: resolve(__dirname, "./src/utils/constant"),
  },
}
