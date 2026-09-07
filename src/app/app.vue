<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Movie Finder'
const description = 'Search movies, save favourites and organise them into lists.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const links = [{
  label: 'Search',
  to: '/',
  icon: 'i-lucide-search'
}, {
  label: 'Saved',
  to: '/favourites',
  icon: 'i-lucide-star'
}, {
  label: 'Lists',
  to: '/lists',
  icon: 'i-lucide-list'
}]
</script>

<template>
  <UApp>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink
          to="/"
          class="logo-link focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1 inline-flex items-center text-brand-900"
        >
          <AppLogo class="shrink-0 text-brand-900" />
        </NuxtLink>
      </template>

      <template #right>
        <UNavigationMenu
          :items="links"
          variant="link"
          :ui="{
            link: 'text-white hover:text-white',
            linkLeadingIcon: 'size-5 shrink-0 text-white'
          }"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <FooterCopyright />
      </template>

      <template #right>
        <FooterMovieDb />
      </template>
    </UFooter>
  </UApp>
</template>
