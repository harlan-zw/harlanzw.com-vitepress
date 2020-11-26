<template>
<div class="card-post -mx-8 my-8 hover:shadow-lg transition-all">
  <div class="card-post__effect"></div>
  <a class="card-post__link unstyled" href="/blog/building-a-blog-with-vitepress/"></a>
  <div class="card-post__content">
      <div class="p-8 prose prose-xl">
        <h3 style="margin-top: 0 !important;"><a href="/blog/building-a-blog-with-vitepress/" class="text-2xl" style="font-weight: bold;">Vue Bleeding Edge: Vite & VitePress</a></h3>

        <div class="text-xs text-gray-600"><time>24th Nov 2020</time></div>

        <p class="text-md text-gray-600">I had a play around with Vite, VitePress to build a new blazing ⚡ fast blog. Learn about how the latest Vue tech is making your life easier.</p>
      </div>
  </div>
</div>
</template>

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