import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { join } from 'path'

export default defineConfig(async({ command }) => {
  const plugins = []

  return {
    plugins: [
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: true,
        resolvers: [
          IconsResolver(),
        ],
      }),
      Icons(),
      WindiCSS({
        scan: {
          dirs: [
            __dirname,
            join(__dirname, '.vitepress', 'theme'),
            join(__dirname, '.vitepress', 'theme', 'components'),
          ],
        },
      }),
      ...plugins,
    ],

    optimizeDeps: {
      include: [
        'vue',
      ],
    },
  }
})
