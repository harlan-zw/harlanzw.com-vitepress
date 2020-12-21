<template>
<div>
  <h1>Hi there  {{ name }} :)</h1>
</div>
</template>
<script>
export default {
  props: {
    name: String
  }
}
</script>