<template>
<div class="nav-item">
  <a
      class="nav-link font-semibold text-gray-700 d-block"
      :class="classes"
      :href="href"
      :target="target"
      :rel="rel"
      :aria-label="item.ariaLabel"
  >
    {{ item.text }}
    <OutboundLink v-if="isExternalLink" />
  </a>
</div>
</template>

<script src="./NavBarLink"></script>
