<script setup lang="ts">
const props = withDefaults(defineProps<{
  moviedbId: number
  title: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'md'
})

const emit = defineEmits<{
  (event: 'added' | 'removed', listId: string): void
}>()

const open = ref(false)
const { lists, fetchLists, addMovieToList, removeMovieFromList } = useLists()
const pendingId = ref<string | null>(null)
const error = ref<string | null>(null)
const newTitle = ref('')
const creating = ref(false)

const movieKey = computed(() => `movie:${props.moviedbId}`)

const isSaved = computed(() =>
  lists.value.some(list => (list.movieIds ?? []).includes(movieKey.value))
)

function isInList(listId: string): boolean {
  const list = lists.value.find(item => item.id === listId)
  return list ? (list.movieIds ?? []).includes(movieKey.value) : false
}

function openPicker() {
  open.value = true
  error.value = null
  fetchLists()
}

async function addToList(listId: string) {
  pendingId.value = listId
  error.value = null
  try {
    await addMovieToList(listId, props.moviedbId)
    emit('added', listId)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to add movie to list.'
  } finally {
    pendingId.value = null
  }
}

async function removeFromList(listId: string) {
  pendingId.value = listId
  error.value = null
  try {
    await removeMovieFromList(listId, props.moviedbId)
    emit('removed', listId)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to remove movie from list.'
  } finally {
    pendingId.value = null
  }
}

async function createAndAdd() {
  const title = newTitle.value.trim()
  if (!title) {
    return
  }
  creating.value = true
  error.value = null
  try {
    const list = await $fetch<{ id: string }>('/api/lists', { method: 'POST', body: { title } })
    await fetchLists()
    await addToList(list.id)
    newTitle.value = ''
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create list.'
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  if (!lists.value.length) {
    fetchLists()
  }
})
</script>

<template>
  <div class="inline-flex">
    <UButton
      icon="i-lucide-list-plus"
      :label="isSaved ? 'Added' : 'Add'"
      :color="isSaved ? 'primary' : 'neutral'"
      :variant="isSaved ? 'solid' : 'outline'"
      :size="size"
      :class="isSaved ? 'list-saved' : undefined"
      :aria-pressed="isSaved"
      @click="openPicker"
    />

    <UModal
      v-model:open="open"
      :title="`Add to a list`"
    >
      <template #body>
        <div class="flex flex-col gap-3">
          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :title="error"
          />

          <div
            v-if="!lists.length"
            class="text-sm text-muted"
          >
            No lists yet. Create one below.
          </div>

          <ul
            v-else
            class="flex flex-col gap-2"
          >
            <li
              v-for="list in lists"
              :key="list.id"
              class="flex items-center justify-between gap-2 border border-default rounded-md px-3 py-2"
            >
              <span class="text-sm font-medium truncate">{{ list.title }}</span>
              <div class="flex items-center gap-2 shrink-0">
                <UBadge
                  v-if="isInList(list.id)"
                  variant="subtle"
                  size="xs"
                >
                  Saved
                </UBadge>
                <UButton
                  v-if="isInList(list.id)"
                  label="Remove"
                  size="xs"
                  color="error"
                  variant="ghost"
                  :loading="pendingId === list.id"
                  @click="removeFromList(list.id)"
                />
                <UButton
                  v-else
                  label="Add"
                  size="xs"
                  :loading="pendingId === list.id"
                  @click="addToList(list.id)"
                />
              </div>
            </li>
          </ul>

          <form
            class="flex gap-2"
            @submit.prevent="createAndAdd"
          >
            <UInput
              v-model="newTitle"
              placeholder="New list name"
              maxlength="80"
              class="flex-1"
            />
            <UButton
              type="submit"
              label="Create"
              :loading="creating"
              :disabled="!newTitle.trim()"
            />
          </form>
        </div>
      </template>
    </UModal>
  </div>
</template>
