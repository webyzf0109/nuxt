export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'Expires', content: '0' },
      { 'http-equiv': 'Pragma', content: 'no-cache' },
      { 'http-equiv': 'Cache-control', content: 'no-cache' },
      { 'http-equiv': 'Cache', content: 'no-cache' },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      },
      { hid: 'description', name: 'description', content: '' }

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: '/rem.js', type: 'text/javascript', charset: 'utf-8' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // 项目里要使用的 SCSS 文件
    '@/assets/css/common.css',
    '@/assets/css/form.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~api/cmcc.js',mode: 'client'},
    // { src: '~plugins/api.js',mode: 'client'},
    { src: '~plugins/vant.js', ssr: true }

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    prefix: '/ocs_cmcc_promotion/',
    proxy: true
  },
  proxy: {
    '/ocs_cmcc_promotion/': {
      target: 'https://cmcc.refectman.com',
      pathRewrite: {
        '^/ocs_cmcc_promotion/': ''
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  // router:{
  //   base:'/nuxt'
  // },
  generate:{
      dir:'docs',
      subFolders:false,
  }
}
