<script setup lang="ts">
interface MovieDetails {
  id: number
  title: string
  overview: string
  tagline: string | null
  releaseDate: string | null
  runtime: number | null
  genres: Array<{ id: number, name: string }>
  posterUrl: string | null
  backdropUrl: string | null
  voteAverage: number
  voteCount: number
}

const route = useRoute()
const movieId = computed(() => String(route.params.id))

const movie = ref<MovieDetails | null>(null)
const pending = ref(true)
const error = ref<string | null>(null)

const { isFavourite, toggleFavourite, fetchFavourites } = useFavourites()
const toast = useToast()
const toggling = ref(false)

async function load() {
  pending.value = true
  error.value = null
  try {
    movie.value = await $fetch<MovieDetails>(`/api/movies/${movieId.value}`)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load movie.'
  } finally {
    pending.value = false
  }
}

async function onToggleFavourite() {
  if (!movie.value) {
    return
  }
  toggling.value = true
  try {
    await toggleFavourite(movie.value.id)
    toast.add({
      title: isFavourite(movie.value.id) ? 'Saved to favourites' : 'Removed from favourites'
    })
  } catch (err: unknown) {
    toast.add({
      title: 'Could not update favourites',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    toggling.value = false
  }
}

watch(movieId, load)

onMounted(async () => {
  await Promise.all([load(), fetchFavourites()])
})
</script>

<template>
  <UContainer class="py-8 flex flex-col gap-6">
    <UButton to="/" label="Back to search" icon="i-lucide-arrow-left" color="neutral" variant="ghost" class="self-start" />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Movie not found"
      :description="error"
    />

    <div v-else-if="pending" class="flex flex-col sm:flex-row gap-6">
      <USkeleton class="w-full sm:w-72 aspect-[2/3]" />
      <div class="flex-1 flex flex-col gap-3">
        <USkeleton class="h-8 w-2/3" />
        <USkeleton class="h-4 w-1/3" />
        <USkeleton class="h-24 w-full" />
      </div>
    </div>

    <article v-else-if="movie" class="flex flex-col sm:flex-row gap-6">
      <img
        v-if="movie.posterUrl"
        :src="movie.posterUrl"
        :alt="`Poster for ${movie.title}`"
        class="w-full sm:w-72 rounded-lg object-cover bg-muted self-start"
      >
      <div v-else class="w-full sm:w-72 aspect-[2/3] rounded-lg bg-muted flex items-center justify-center text-sm text-muted">
        No poster available
      </div>

      <div class="flex-1 flex flex-col gap-3 min-w-0">
        <h1 class="text-2xl font-bold">
          {{ movie.title }}
        </h1>
        <p v-if="movie.tagline" class="text-muted italic">
          {{ movie.tagline }}
        </p>
        <p class="text-sm text-muted">
          {{ movie.releaseDate || 'Unknown release date' }}
          <span v-if="movie.runtime"> • {{ movie.runtime }} min</span>
          <span> • ★ {{ movie.voteAverage.toFixed(1) }} ({{ movie.voteCount }} votes)</span>
        </p>
        <div v-if="movie.genres.length" class="flex flex-wrap gap-1">
          <UBadge v-for="genre in movie.genres" :key="genre.id" variant="subtle">
            {{ genre.name }}
          </UBadge>
        </div>
        <p class="leading-relaxed">
          {{ movie.overview || 'No overview available.' }}
        </p>

        <div class="flex gap-2 flex-wrap pt-1">
          <UButton
            :icon="isFavourite(movie.id) ? 'i-lucide-heart-off' : 'i-lucide-heart'"
            :label="isFavourite(movie.id) ? 'Saved to favourites' : 'Save to favourites'"
            :color="isFavourite(movie.id) ? 'primary' : 'neutral'"
            :variant="isFavourite(movie.id) ? 'solid' : 'outline'"
            :loading="toggling"
            :aria-pressed="isFavourite(movie.id)"
            @click="onToggleFavourite"
          />
          <GroupPicker :moviedb-id="movie.id" :title="movie.title" />
        </div>
      </div>
    </article>
  </UContainer>
</template>
