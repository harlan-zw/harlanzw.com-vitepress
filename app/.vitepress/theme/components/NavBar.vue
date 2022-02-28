<script>
import NavBarLinks from './NavBarLinks.vue';
import { withBase, useData } from 'vitepress'
export default {
  components: {
    NavBarLinks
  },
  setup() {
    const { site } = useData();
    return {
      site,
      withBase,
    }
  }
}
</script>
<template>
<div class="w-full flex items-center justify-between border-b-2 border-gray-100 py-3 md:py-6">
  <div class="relative ml-2 md:ml-0">
    <svg class="blob" viewBox="0 0 200 200" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <path fill="rgb(5, 150, 105)" d="M50.4,-15.8C59.3,10.9,56.2,42.1,36,58.9C15.9,75.8,-21.4,78.3,-41.8,62.4C-62.2,46.4,-65.8,11.9,-56,-16C-46.2,-43.9,-23.1,-65.4,-1.2,-65C20.8,-64.6,41.5,-42.4,50.4,-15.8Z" transform="translate(100 100)" />
    </svg>
    <a
        class="logo"
        :aria-label="site.title + ', back to home'"
        :href="withBase('/')"
    >
      <span class="font-bold font-header text-green-700">harlan</span>
    </a>
  </div>
  <div class="flex-grow"></div>
  <NavBarLinks/>
</div>
</template>


<style lang="scss">
.blob {
  position: absolute;
  left: -25px;
  top: -14px;
  z-index: 0;
  transform: rotate(45deg);
  opacity: 0.2;
}
.logo {
  position: relative;
  font-size: 1.8em !important;
  color: rgb(5, 150, 105) !important;
  z-index: 1;
}
</style>
