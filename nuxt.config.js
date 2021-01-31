import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    ROOT: process.env.ROOT,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: true,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'server',

  axios: {
    baseURL: process.env.ROOT || 'http://localhost:3000', // Used as fallback if no runtime config is provided
  },

  head: {
    titleTemplate: '%s',
    title: 'Equivalencias en definiciones CEV - RUV - CNMH',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Se visualizan las equivalencias entre términos de hechos entre el tesauro y las bases de datos del RUV y del CNMH. Asimismo se incluyen tablas con las definiciones de cada término' },
      { hid: 'keywords', name: 'keywords', content: 'CNMH, Definiciones, grafo, Hechos victimizantes, RUV, Tableros, Tesauro' },
      { hid: 'author', name: 'author', content: 'Fabian Rios' },
      { hid: 'article-published_time', name: 'article-published_time', property: 'article:published_time', content: '2021-01-30T13:47:16-0100' },
      { hid: 'article-modified_time', name: 'article-modified_time', property: 'article:modified_time', content: '2021-01-30T16:47:16-0100' },
      { hid: 'og:image', name: 'image', property: 'og:image', content: '/miniatura.png' },
      { property: "og:image:width", content: "800" },
      { property: "og:image:height", content: "600" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/main.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~node_modules/d3/dist/d3.js', ssr: false}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['@nuxtjs/axios']
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: '#EDEDED'
        }
      }
    }
  },
  buildDir: 'dist',

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
