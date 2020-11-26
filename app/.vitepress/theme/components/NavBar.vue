<template>
  <a
      class="font-semibold text-gray-700"
      :aria-label="$site.title + ', back to home'"
      :href="$site.base"
  >
    <span>hzw</span>
  </a>
<div class="flex-grow"></div>
<NavBarLinks class="hide-mobile" />
</template>

<script src="./NavBar"></script>

<style>
.title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--c-text);
}

.title:hover {
  text-decoration: none;
}

.flex-grow {
  flex-grow: 1;
}

.logo {
  margin-right: 0.75rem;
  height: 1.3rem;
  vertical-align: bottom;
}

@media screen and (max-width: 719px) {
  .hide-mobile {
    display: none;
  }
}
</style>
