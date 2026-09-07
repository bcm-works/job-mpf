<script setup lang="ts">
useSeoMeta({ title: 'Movie groups' })

const { groups, pending, error, fetchGroups, createGroup, deleteGroup } = useGroups()
const newTitle = ref('')
const creating = ref(false)
const formError = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const toast = useToast()

async function onCreate() {
  const title = newTitle.value.trim()
  if (!title) {
    return
  }
  creating.value = true
  formError.value = null
  try {
    await createGroup(title)
    newTitle.value = ''
  } catch (err: unknown) {
    formError.value = err instanceof Error ? err.message : 'Failed to create group.'
  } finally {
    creating.value = false
  }
}

async function onDelete(id: string) {
  deletingId.value = id
  try {
    await deleteGroup(id)
  } catch (err: unknown) {
    toast.add({
      title: 'Could not delete group',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchGroups)
</script>

<template>
  <UContainer class="py-8 flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-bold">
        Movie groups
      </h1>
      <p class="text-muted mt-1">
        Organise movies into lists. Deleted groups are soft-removed and hidden.
      </p>
    </div>

    <UCard>
      <form
        class="flex gap-2"
        @submit.prevent="onCreate"
      >
        <UInput
          v-model="newTitle"
          placeholder="New group name, e.g. Friday night"
          maxlength="80"
          class="flex-1"
        />
        <UButton
          type="submit"
          label="Create group"
          icon="i-lucide-plus"
          :loading="creating"
          :disabled="!newTitle.trim()"
        />
      </form>
      <p
        v-if="formError"
        class="text-sm text-error mt-2"
      >
        {{ formError }}
      </p>
    </UCard>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Something went wrong"
      :description="error"
    />

    <div
      v-if="pending && !groups.length"
      class="flex flex-col gap-2"
    >
      <USkeleton
        v-for="n in 3"
        :key="n"
        class="h-16 w-full"
      />
    </div>

    <ul
      v-else-if="groups.length"
      class="flex flex-col gap-3"
    >
      <li
        v-for="group in groups"
        :key="group.id"
      >
        <UCard>
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <NuxtLink
                :to="`/groups/${group.id}`"
                class="font-semibold hover:text-primary truncate block"
              >
                {{ group.title }}
              </NuxtLink>
              <p class="text-sm text-muted">
                {{ group.movieIds.length }} movie{{ group.movieIds.length === 1 ? '' : 's' }}
              </p>
            </div>
            <div class="flex gap-2 shrink-0">
              <UButton
                :to="`/groups/${group.id}`"
                label="Open"
                size="xs"
                variant="outline"
              />
              <UButton
                label="Delete"
                size="xs"
                color="error"
                variant="ghost"
                :loading="deletingId === group.id"
                @click="onDelete(group.id)"
              />
            </div>
          </div>
        </UCard>
      </li>
    </ul>

    <UEmpty
      v-else-if="!pending"
      icon="i-lucide-folder"
      title="No groups yet"
      description="Create your first group above."
    />
  </UContainer>
</template>
