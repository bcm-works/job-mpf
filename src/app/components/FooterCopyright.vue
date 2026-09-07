<template>
  <div class="copyright-container">
    <span class="copyright-text">Created by</span>
    <a
      href="https://bcm.works"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Brendan Murty"
      class="copyright-link"
    >
      Brendan Murty
    </a>
  </div>
</template>

<style scoped>
.copyright-container {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.copyright-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ui-text-muted);
}

.copyright-link {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
