<script setup>
defineOptions({ inheritAttrs: false })
</script>

<template>
  <span
    v-bind="$attrs"
    class="inline-flex items-center gap-0 text-brand-900"
  >
    <img
      src="/icons/logo.svg"
      alt="Movie Finder logo"
      class="size-10 shrink-0"
    >
    <span class="font-semibold whitespace-nowrap text-brand-900">Movie Finder</span>
  </span>
</template>
