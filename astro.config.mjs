import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [icon()],
  site: 'https://rhaz05.github.io',
  base: '//grace-baptist-church',
})
