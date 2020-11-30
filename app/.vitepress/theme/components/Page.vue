<template>
<div class="page">
  <slot name="top" />
  <div class="mx-auto prose prose-xl prose-green">
    <Content />
  </div>

  <slot name="bottom" />
</div>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    const zoom = inject('zoom')

    return {
      zoom
    }
  },
  watch: {
    $page: {
      handler () {
        if (this.zoom) {
          setTimeout(() => {
            this.zoom.listen('.prose img')
          }, 500)
        }
        if (typeof document !== 'undefined') {
          // @todo fix vitepress seo
          document.querySelector('meta[name="description"]').setAttribute('content', this.$page.frontmatter.description);
        }
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 100px 0;
}
</style>
