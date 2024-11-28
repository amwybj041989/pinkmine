<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useAppStore from '@/stores/modules/app';
import useRouteCache from '@/stores/modules/routeCache';
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher';

useHead({
  title: 'hash Finace',
  meta: [
    {
      name: 'theme-color',
      content: () => (isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => (preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
});

const appStore = useAppStore();
const { mode } = storeToRefs(appStore);

const { initializeThemeSwitcher } = useAutoThemeSwitcher(appStore);

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[];
});
function setRem() {
  var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  var rootFontSize = viewportWidth / 10;
  document.documentElement.style.fontSize = rootFontSize + 'px';
}

onMounted(() => {
  setRem();
  initializeThemeSwitcher();
  window.addEventListener('resize', setRem);
});
</script>

<template>
  <!-- <Suspense> -->
    <VanConfigProvider :theme="mode">
      <!-- <NavBar /> -->
      <router-view v-slot="{ Component, route }">
        <section class="app-wrap title-color webp">
          <keep-alive :include="keepAliveRouteNames">
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </section>
      </router-view>
      <TabBar />
    </VanConfigProvider>
  <!-- </Suspense> -->
</template>

<style scoped>
.app-wrap {
  position: relative;
  box-sizing: border-box;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  font-size: calc(var(--base) * 12);
  padding-bottom: 15vh;
  overflow-y: scroll;
  color: var(--title-color);
}
</style>
