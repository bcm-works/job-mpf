<script setup lang="ts">
const props = defineProps<{
  moviedbId: number
  title: string
  overview: string
  posterUrl: string | null
  releaseDate: string | null
  voteAverage?: number | null
  isFavourite: boolean
  favouritePending?: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-favourite', moviedbId: number): void
}>()

const year = computed(() => {
  if (!props.releaseDate) {
    return 'Unknown year'
  }
  const parsed = new Date(props.releaseDate)
  return Number.isNaN(parsed.getTime()) ? 'Unknown year' : String(parsed.getFullYear())
})

const rating = computed(() => {
  if (typeof props.voteAverage !== 'number') {
    return null
  }
  return props.voteAverage.toFixed(1)
})
</script>

<template>
  <UCard
    :ui="{ body: 'p-0 sm:p-0' }"
    class="movie-card"
  >
    <NuxtLink
      :to="`/movies/${moviedbId}`"
      class="block focus-visible:outline-3 outline-primary/25 rounded-t-lg overflow-hidden"
    >
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="`Poster for ${title}`"
        class="w-full aspect-[2/3] object-cover bg-muted"
        loading="lazy"
      >
      <div
        v-else
        class="w-full aspect-[2/3] flex items-center justify-center bg-muted text-muted text-sm px-4 text-center"
      >
        No poster available
      </div>
    </NuxtLink>

    <div class="p-4 flex flex-col gap-2 flex-1 movie-card-body">
      <NuxtLink
        :to="`/movies/${moviedbId}`"
        class="font-semibold leading-snug hover:text-primary line-clamp-2"
      >
        {{ title }}
      </NuxtLink>
      <p class="text-sm text-muted">
        {{ year }}<span v-if="rating"> • ★ {{ rating }}</span>
      </p>
      <p class="text-sm text-muted line-clamp-3">
        {{ overview || 'No overview available.' }}
      </p>

      <div class="flex gap-2 flex-wrap pt-1 movie-card-actions">
        <UButton
          icon="i-lucide-star"
          :label="isFavourite ? 'Saved' : 'Save'"
          :color="isFavourite ? 'primary' : 'neutral'"
          :variant="isFavourite ? 'solid' : 'outline'"
          size="xs"
          :class="isFavourite ? 'favourite-saved' : undefined"
          :loading="favouritePending"
          :aria-pressed="isFavourite"
          @click="emit('toggle-favourite', moviedbId)"
        />
        <ListPicker
          :moviedb-id="moviedbId"
          :title="title"
          size="xs"
        />
      </div>
    </div>
  </UCard>
</template>
