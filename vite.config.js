import vitePluginString from 'vite-plugin-string'

export default {
  plugins: [
    vitePluginString()
  ],
  server: {
    host: true
  },
  build: {
    target: "ES2022"
  }
}
