<template>
<nav class="nav-links">
  <div class="hidden md:block">
    <NavBarLink v-if="navData" v-for="item of navData" :item="item" class="inline-block ml-8"/>
  </div>
  <div class="-mr-2 -my-2 md:hidden">
    <button type="button" @click="menuOpen = true" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
      <span class="sr-only">Open menu</span>
      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</nav>
<div :class="menuClasses" class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
  <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
    <div class="pt-5 pb-6 px-5">
      <button type="button" @click="menuOpen = false" class="absolute z-20 top-4 right-4 bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
        <span class="sr-only">Close menu</span>
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="text-center">
        <NavBarLink v-if="navData" v-for="item of navData" :item="item" class="mb-2"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavBarLink from './NavBarLink.vue'

export default {
  components: {
    NavBarLink,
  },
  data () {
    return {
      menuOpen: false,
    }
  },
  watch: {
    $page() {
      this.menuOpen = false
    }
  },
  computed: {
    navData () {
      return this.$site.themeConfig.nav
    },
    menuClasses () {
      return this.menuOpen ?
          ['opacity-100', 'scale-100', 'duration-200', 'ease-out'] :
          ['opacity-0', 'scale-95', 'duration-100', 'ease-in', 'pointer-events-none']
    }
  }
}

</script>

<style>
.nav-links {
  display: flex;
  align-items: center;
  list-style-type: none;
  transform: translateY(1px);
}
</style>
