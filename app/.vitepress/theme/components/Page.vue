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
    '$page.path': {
      handler () {
        if (this.zoom) {
          setTimeout(() => {
            this.zoom.listen('.prose img')
          }, 500)
        }
      },
      immediate: true
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
