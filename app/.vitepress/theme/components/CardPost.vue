<template>
<div class="card-post md:-mx-8 my-8 hover:shadow-lg transition-all">
  <div class="card-post__effect"></div>
  <a class="card-post__link unstyled" :href="post.url"></a>
  <div class="card-post__content">
      <div class="md:p-8 p-4 prose md:prose-xl">
        <h3 style="margin-top: 0 !important;"><a :href="post.url" class="md:text-2xl" style="font-weight: bold;">{{ post.title }}</a></h3>

        <div class="text-xs text-gray-600">
          <time class="mr-2">{{ post.publishDate }}</time>- {{ post.readMins }}min
        </div>

        <p class="text-sm text-gray-600">{{ post.excerpt }}</p>

        <PostTags :post="post" />
      </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Post } from '../../types'
import PostTags from './PostTags.vue'

export default defineComponent({
  components: {
    PostTags
  },
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.card-post {

  position: relative;

  .prose {
    max-width: 100% !important;
  }

  &__link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: ' ';
    z-index: 1;
  }

  &__content {
    background-color: white;
    z-index: 1;
  }

  &__effect {
    z-index: -1;
    content: ' ';
    height: 30px;
    width: 100%;
    position: absolute;
    background-color: rgb(5, 150, 105);
    transition: 0.2s;
    opacity: 0;
    top: 30px;
  }

  &:hover {
    .card-post__effect {
      top: -5px;
      opacity: 1;
      transform: rotate(0.25deg);
    }
  }
}
</style>
