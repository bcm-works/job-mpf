<template>
  <div class="themoviedb-container">
    <span class="themoviedb-text">Images provided by</span>
    <a
      href="https://www.themoviedb.org/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="The Movie Database"
      class="themoviedb-link"
    >
      <img
        src="/icons/themoviedb.svg"
        alt="The Movie Database"
        class="themoviedb-image"
      >
    </a>
  </div>
</template>

<style scoped>
.themoviedb-container {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.themoviedb-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--ui-text-muted);
}

.themoviedb-link {
  display: inline-flex;
  align-items: center;
}

.themoviedb-image {
  height: 1rem;
  width: auto;
}
</style>
