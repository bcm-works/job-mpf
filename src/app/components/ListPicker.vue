<script setup lang="ts">
const props = defineProps<{
  moviedbId: number
  title: string
}>()

const emit = defineEmits<{
  (event: 'added', listId: string): void
}>()

const open = ref(false)
const { lists, fetchLists, addMovieToList } = useLists()
const pendingId = ref<string | null>(null)
const error = ref<string | null>(null)
const newTitle = ref('')
const creating = ref(false)

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
    open.value = false
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to add movie to list.'
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
</script>

<template>
  <div class="inline-flex">
    <UButton
      icon="i-lucide-list-plus"
      label="List"
      color="neutral"
      variant="ghost"
      size="xs"
      @click="openPicker"
    />

    <UModal
      v-model:open="open"
      :title="`Add “${title}” to a list`"
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
              <UButton
                label="Add"
                size="xs"
                :loading="pendingId === list.id"
                @click="addToList(list.id)"
              />
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
