import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { join } from 'path'
import { SchemaOrgResolver, schemaOrgAutoImports } from '@vueuse/schema-org-vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(async({ command }) => {
  const plugins = []

  return {
    plugins: [
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: true,
        resolvers: [
          SchemaOrgResolver(),
          IconsResolver(),
        ],
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          'vue',
          schemaOrgAutoImports,
        ],
        dts: 'auto-imports.d.ts',
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
