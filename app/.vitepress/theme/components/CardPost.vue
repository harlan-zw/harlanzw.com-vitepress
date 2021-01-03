<template>
<div class="card-post md:-mx-8 my-8 hover:shadow-lg transition-all">
  <div class="card-post__effect"></div>
  <a class="card-post__link unstyled" :href="post.url"></a>
  <div class="card-post__content">
      <div class="md:p-8 p-4 prose md:prose-xl">
        <h3 style="margin-top: 0 !important;"><a :href="post.url" class="md:text-2xl" style="font-weight: bold;">{{ post.title }}</a></h3>

        <div class="text-xs text-gray-600">
          <time class="mr-4">{{ post.published }}</time>
          <span v-if="post.tags.indexOf('vue') >= 0" class="mr-2">
            <svg class="inline-block" height="15" viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg"><title>Vue.js logo</title><g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)"><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883"/></g><g transform="translate(178.06 235.01)"><path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e"/></g></g></svg>
            Vue.js
          </span>
          <span v-if="post.tags.indexOf('webpack') >= 0">
            <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 600 600"><title>Webpack logo</title><path fill="#FFF" d="M300 .1L565 150v299.9L300 599.8 35 449.9V150z"/><path fill="#8ED6FB" d="M517.7 439.5L308.8 557.8v-92L439 394.1l78.7 45.4zm14.3-12.9V179.4l-76.4 44.1v159l76.4 44.1zM81.5 439.5l208.9 118.2v-92l-130.2-71.6-78.7 45.4zm-14.3-12.9V179.4l76.4 44.1v159l-76.4 44.1zm8.9-263.2L290.4 42.2v89l-137.3 75.5-1.1.6-75.9-43.9zm446.9 0L308.8 42.2v89L446 206.8l1.1.6 75.9-44z"/><path fill="#1C78C0" d="M290.4 444.8L162 374.1V234.2l128.4 74.1v136.5zm18.4 0l128.4-70.6v-140l-128.4 74.1v136.5zM299.6 303zm-129-85l129-70.9L428.5 218l-128.9 74.4-129-74.4z"/></svg>
            webpack
          </span>
        </div>

        <p class="text-sm text-gray-600">{{ post.excerpt }}</p>
      </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    }
  },
}
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
