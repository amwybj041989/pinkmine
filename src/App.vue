<template>
  <div class="">
    <VanConfigProvider :theme="mode">
      <router-view v-slot="{ Component, route }">
        <section class="app-wrap title-color webp capitalize relative">
          <keep-alive :include="keepAliveRouteNames">
            <component :is="Component" :key="route.name" />
          </keep-alive>

          <Servicer></Servicer>
        </section>
      </router-view>
      <div class="" v-if="state.loading">
        <van-overlay show teleport="body" :z-index="99999">
          <div class="flex flex_center justify_center loader_wrap">
            <div class="loader"></div>
          </div>
        </van-overlay>
      </div>
    </VanConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/modules';
import useRouteCache from '@/stores/modules/routeCache';
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher';
import { generateRandomGradient } from '@/utils';
import { appName, appDescription } from '@/constants';
import { appKit } from '@/utils/modal';
const { t } = useI18n();
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
import useStateStore from '@/stores/state';
const state = useStateStore();
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
  // setTimeout(() => {
  //   getConnectSataus();
  // }, 5000);
}

onMounted(() => {
  setRem();
  window.addEventListener('resize', setRem);
  nextTick(() => {
    initializeThemeSwitcher();
    generateRandomGradient();
    getConnectSataus();
    state.setLoading(false);
  });
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
/* HTML: <div class="loader"></div> */
.loader_wrap {
  width: 100vw;
  height: 100vh;
}
/* HTML: <div class="loader"></div> */
.loader {
  --r1: 154%;
  --r2: 68.5%;
  width: 80px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--gradient-color1) 80%), radial-gradient(var(--r1) var(--r2) at bottom, var(--gradient-color2) 79.5%, #0000 80%),
    radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, var(--gradient-color3) 80%), #ccc;
  background-size: 50.5% 220%;
  background-position: -100% 0%, 0% 0%, 100% 0%;
  background-repeat: no-repeat;
  animation: l9 2s infinite linear;
}
@keyframes l9 {
  33% {
    background-position: 0% 33%, 100% 33%, 200% 33%;
  }
  66% {
    background-position: -100% 66%, 0% 66%, 100% 66%;
  }
  100% {
    background-position: 0% 100%, 100% 100%, 200% 100%;
  }
}
</style>
