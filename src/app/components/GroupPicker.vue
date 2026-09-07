<script setup lang="ts">
const props = defineProps<{
  moviedbId: number
  title: string
}>()

const emit = defineEmits<{
  (event: 'added', groupId: string): void
}>()

const open = ref(false)
const { groups, fetchGroups, addMovieToGroup } = useGroups()
const pendingId = ref<string | null>(null)
const error = ref<string | null>(null)
const newTitle = ref('')
const creating = ref(false)

function openPicker() {
  open.value = true
  error.value = null
  fetchGroups()
}

async function addToGroup(groupId: string) {
  pendingId.value = groupId
  error.value = null
  try {
    await addMovieToGroup(groupId, props.moviedbId)
    emit('added', groupId)
    open.value = false
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to add movie to group.'
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
    const group = await $fetch<{ id: string }>('/api/groups', { method: 'POST', body: { title } })
    await fetchGroups()
    await addToGroup(group.id)
    newTitle.value = ''
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create group.'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="inline-flex">
    <UButton
      icon="i-lucide-folder-plus"
      label="Group"
      color="neutral"
      variant="ghost"
      size="xs"
      @click="openPicker"
    />

    <UModal v-model:open="open" :title="`Add “${title}” to a group`">
      <template #body>
        <div class="flex flex-col gap-3">
          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            :title="error"
          />

          <div v-if="!groups.length" class="text-sm text-muted">
            No groups yet. Create one below.
          </div>

          <ul v-else class="flex flex-col gap-2">
            <li v-for="group in groups" :key="group.id" class="flex items-center justify-between gap-2 border border-default rounded-md px-3 py-2">
              <span class="text-sm font-medium truncate">{{ group.title }}</span>
              <UButton
                label="Add"
                size="xs"
                :loading="pendingId === group.id"
                @click="addToGroup(group.id)"
              />
            </li>
          </ul>

          <form class="flex gap-2" @submit.prevent="createAndAdd">
            <UInput
              v-model="newTitle"
              placeholder="New group name"
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
