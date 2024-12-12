<template>
  <VanConfigProvider :theme="mode">
    <router-view v-slot="{ Component, route }">
      <section class="app-wrap title-color webp capitalize relative">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" :key="route.name" />
        </keep-alive>
        <Servicer></Servicer>
      </section>
    </router-view>

    <TabBar />
  </VanConfigProvider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules';
import useRouteCache from '@/stores/modules/routeCache';
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher';
import { generateRandomGradient } from '@/utils';
import { appName, appDescription } from '@/constants';
import { appKit } from '@/utils/modal';

import { useUserStore } from '@/stores/modules';
const userStore = useUserStore();
useHead({
  title: appName,
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
  if (rootFontSize >= 43) {
    rootFontSize = 41.4;
  }
  document.documentElement.style.fontSize = rootFontSize + 'px';
}
function getConnectSataus() {
  let isConnected = appKit.getIsConnectedState();
  // if (!isConnected) {
  //   userStore.setAddress('');
  //   userStore.setChainId(0);
  // }
  setTimeout(() => {
    getConnectSataus();
  }, 5000);
}
onMounted(() => {
  setRem();
  initializeThemeSwitcher();
  generateRandomGradient();
  window.addEventListener('resize', setRem);
  getConnectSataus();
});
</script>

<style scoped>
.app-wrap {
  position: relative;
  box-sizing: border-box;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  font-size: calc(var(--base) * 12);
  /* padding-bottom: 15vh; */
  /* overflow-y: scroll; */
  color: var(--title-color);
}
</style>
