<script setup lang="ts">
useSeoMeta({ title: 'Favourite movies' })

const { favourites, pending, error, fetchFavourites, isFavourite, toggleFavourite } = useFavourites()
const toast = useToast()
const togglingId = ref<number | null>(null)

async function onToggleFavourite(moviedbId: number) {
  togglingId.value = moviedbId
  try {
    await toggleFavourite(moviedbId)
  } catch (err: unknown) {
    toast.add({
      title: 'Could not update favourites',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    togglingId.value = null
  }
}

onMounted(fetchFavourites)
</script>

<template>
  <UContainer class="py-8 flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold">
        Favourite movies
      </h1>
      <p class="text-muted mt-1">
        {{ favourites.length }} saved movie{{ favourites.length === 1 ? '' : 's' }}
      </p>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Something went wrong"
      :description="error"
    />

    <div v-if="pending && !favourites.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <USkeleton v-for="n in 4" :key="n" class="aspect-[2/3] w-full" />
    </div>

    <div v-else-if="favourites.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <MovieCard
        v-for="movie in favourites"
        :key="movie.moviedbId"
        :moviedb-id="movie.moviedbId"
        :title="movie.title"
        :overview="movie.overview"
        :poster-url="movie.image || null"
        :release-date="movie.releaseDate"
        :is-favourite="isFavourite(movie.moviedbId)"
        :favourite-pending="togglingId === movie.moviedbId"
        @toggle-favourite="onToggleFavourite"
      />
    </div>

    <UEmpty
      v-else-if="!pending"
      icon="i-lucide-heart"
      title="No favourites yet"
      description="Search for movies and save the ones you love."
    >
      <template #actions>
        <UButton to="/" label="Search movies" icon="i-lucide-search" />
      </template>
    </UEmpty>
  </UContainer>
</template>
