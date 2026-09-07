<script setup lang="ts">
interface MovieSummary {
  id: number
  title: string
  overview: string
  releaseDate: string | null
  posterUrl: string | null
  voteAverage: number | null
}

interface PagedMovies {
  page: number
  totalPages: number
  totalResults: number
  results: MovieSummary[]
}

useSeoMeta({ title: 'Search movies' })

const query = ref('')
const page = ref(1)
const results = ref<MovieSummary[]>([])
const totalPages = ref(0)
const totalResults = ref(0)
const pending = ref(false)
const error = ref<string | null>(null)
const emptySearch = ref(false)

const { fetchFavourites, isFavourite, toggleFavourite } = useFavourites()
const toast = useToast()
const togglingId = ref<number | null>(null)
let debounce: ReturnType<typeof setTimeout> | null = null

async function loadMovies() {
  pending.value = true
  error.value = null
  try {
    if (query.value.trim()) {
      emptySearch.value = false
      const data = await $fetch<PagedMovies>('/api/movies/search', {
        query: { query: query.value.trim(), page: page.value }
      })
      results.value = data.results
      totalPages.value = data.totalPages
      totalResults.value = data.totalResults
    } else {
      emptySearch.value = true
      const data = await $fetch<PagedMovies>('/api/movies/popular', {
        query: { page: page.value }
      })
      results.value = data.results
      totalPages.value = data.totalPages
      totalResults.value = data.totalResults
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load movies.'
  } finally {
    pending.value = false
  }
}

function onQueryInput() {
  page.value = 1
  if (debounce) {
    clearTimeout(debounce)
  }
  debounce = setTimeout(loadMovies, 400)
}

function onPageChange(next: number) {
  page.value = next
  loadMovies()
}

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

onMounted(async () => {
  await Promise.all([loadMovies(), fetchFavourites()])
})
</script>

<template>
  <UContainer class="py-8 flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold">
        Search movies
      </h1>
      <p class="text-muted mt-1">
        {{ emptySearch ? 'Popular movies. Type to search the full catalogue.' : `${totalResults} result${totalResults === 1 ? '' : 's'}` }}
      </p>
    </div>

    <UInput
      v-model="query"
      icon="i-lucide-search"
      placeholder="Search by title, e.g. jack reacher"
      size="lg"
      :trailing="false"
      @input="onQueryInput"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Something went wrong"
      :description="error"
    />

    <div
      v-if="pending && !results.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <USkeleton
        v-for="n in 8"
        :key="n"
        class="aspect-[2/3] w-full"
      />
    </div>

    <div
      v-else-if="results.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <MovieCard
        v-for="movie in results"
        :key="movie.id"
        :moviedb-id="movie.id"
        :title="movie.title"
        :overview="movie.overview"
        :poster-url="movie.posterUrl"
        :release-date="movie.releaseDate"
        :vote-average="movie.voteAverage"
        :is-favourite="isFavourite(movie.id)"
        :favourite-pending="togglingId === movie.id"
        @toggle-favourite="onToggleFavourite"
      />
    </div>

    <UEmpty
      v-else-if="!pending"
      icon="i-lucide-film"
      title="No movies found"
      description="Try a different search term."
    />

    <div
      v-if="totalPages > 1"
      class="flex justify-center"
    >
      <UPagination
        :page="page"
        :total="totalResults"
        :items-per-page="results.length || 20"
        @update:page="onPageChange"
      />
    </div>
  </UContainer>
</template>
