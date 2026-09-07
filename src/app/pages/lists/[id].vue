<script setup lang="ts">
import type { FavouriteMovie } from '~/composables/useFavourites'
import type { MovieList } from '~/composables/useLists'

const route = useRoute()
const listId = computed(() => String(route.params.id))

useSeoMeta({ title: 'List details' })

const { fetchListDetail, renameList, removeMovieFromList } = useLists()
const { isFavourite, toggleFavourite, fetchFavourites } = useFavourites()
const toast = useToast()

const list = ref<MovieList | null>(null)
const movies = ref<FavouriteMovie[]>([])
const pending = ref(true)
const error = ref<string | null>(null)
const editing = ref(false)
const editTitle = ref('')
const saving = ref(false)
const togglingId = ref<number | null>(null)
const removingId = ref<number | null>(null)

async function load() {
  pending.value = true
  error.value = null
  try {
    const data = await fetchListDetail(listId.value)
    list.value = data.list
    movies.value = data.movies
    editTitle.value = data.list.title
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load list.'
  } finally {
    pending.value = false
  }
}

async function onRename() {
  const title = editTitle.value.trim()
  if (!title || !list.value) {
    return
  }
  saving.value = true
  try {
    list.value = await renameList(list.value.id, title)
    editing.value = false
  } catch (err: unknown) {
    toast.add({
      title: 'Could not rename list',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
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

async function onRemoveMovie(moviedbId: number) {
  if (!list.value) {
    return
  }
  removingId.value = moviedbId
  try {
    await removeMovieFromList(list.value.id, moviedbId)
    movies.value = movies.value.filter(movie => movie.moviedbId !== moviedbId)
  } catch (err: unknown) {
    toast.add({
      title: 'Could not remove movie',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    removingId.value = null
  }
}

onMounted(async () => {
  await Promise.all([load(), fetchFavourites()])
})
</script>

<template>
  <UContainer class="py-8 flex flex-col gap-6">
    <UButton
      to="/lists"
      label="Back to lists"
      icon="i-lucide-arrow-left"
      color="neutral"
      variant="ghost"
      class="self-start"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Something went wrong"
      :description="error"
    />

    <div v-else-if="pending">
      <USkeleton class="h-8 w-48" />
    </div>

    <div
      v-else-if="list"
      class="flex items-center justify-between gap-3 flex-wrap"
    >
      <div v-if="!editing">
        <h1 class="text-2xl font-bold">
          {{ list.title }}
        </h1>
        <p class="text-muted mt-1">
          {{ movies.length }} movie{{ movies.length === 1 ? '' : 's' }}
        </p>
      </div>
      <form
        v-else
        class="flex gap-2 flex-1 min-w-52"
        @submit.prevent="onRename"
      >
        <UInput
          v-model="editTitle"
          maxlength="80"
          class="flex-1"
        />
        <UButton
          type="submit"
          label="Save"
          :loading="saving"
          :disabled="!editTitle.trim()"
        />
        <UButton
          label="Cancel"
          color="neutral"
          variant="ghost"
          @click="editing = false"
        />
      </form>
      <UButton
        v-if="!editing"
        label="Rename"
        icon="i-lucide-pencil"
        size="xs"
        variant="outline"
        @click="editing = true"
      />
    </div>

    <div
      v-if="list && movies.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="movie in movies"
        :key="movie.moviedbId"
        class="flex flex-col gap-1"
      >
        <MovieCard
          :moviedb-id="movie.moviedbId"
          :title="movie.title"
          :overview="movie.overview"
          :poster-url="movie.image || null"
          :release-date="movie.releaseDate"
          :is-favourite="isFavourite(movie.moviedbId)"
          :favourite-pending="togglingId === movie.moviedbId"
          @toggle-favourite="onToggleFavourite"
        />
        <UButton
          label="Remove from list"
          icon="i-lucide-x"
          color="error"
          variant="ghost"
          size="xs"
          :loading="removingId === movie.moviedbId"
          @click="onRemoveMovie(movie.moviedbId)"
        />
      </div>
    </div>

    <UEmpty
      v-else-if="list && !pending"
      icon="i-lucide-list"
      title="No movies in this list yet"
      description="Search for movies and add them to this list."
    >
      <template #actions>
        <UButton
          to="/"
          label="Search movies"
          icon="i-lucide-search"
        />
      </template>
    </UEmpty>
  </UContainer>
</template>
