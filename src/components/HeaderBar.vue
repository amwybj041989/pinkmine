<template>
  <div class="">
    <div class="header_padding"></div>
    <div class="heaerbar_wrap">
      <div class="gbg pad_12">
        <Vue3Marquee :duration="150">
          <div class="flex flex_center justify_sb marquee_item ml_15" v-for="item in list" :key="item.address">
            <div class="webp icon-chain-mini icon-chain-mini-tron shrink_0" v-if="item.type == 1"></div>
            <div class="webp icon-chain-mini icon-chain-mini-bsc shrink_0" v-if="item.type == 2"></div>
            <div class="webp icon-chain-mini icon-chain-mini-ethereum shrink_0" v-if="item.type == 3"></div>
            <div class="ggolden ml_6" v-hash="item.address"></div>
            <div class="shrink_0 mr_6 ml_6 red">
              {{ t('text.outPut') }}
            </div>
            <div class="ggolden bold_700">
              {{ item.quantity }}
            </div>
            <div class="ggolden">
              <span v-if="item.type == 1">TRX</span>
              <span v-if="item.type == 2">BNB</span>
              <span v-if="item.type == 3">ETH</span>
            </div>
          </div>
        </Vue3Marquee>
      </div>
      <div class="heaerbar_action pad_8 flex flex_center justify_sb">
        <div class="logo_title fontSize_20 gcolor light" :data-text="appName">{{ appName }}</div>
        <div class="flex flex flex_center">
          <div class="walletConnect gborder">
            <div class="flex flex_center pad_2_4 gborder_container" @click="connectWallet" v-if="!state.address">
              <div class="color_fff ml_6">{{ t('event.connectWallet') }}</div>
            </div>
            <div class="flex flex_center pad_2_4 gborder_container" v-else @click="gotAccount">
              <div class="webp icon-chain-mini icon-chain-mini-tron" v-if="state.networkType == 'tron'"></div>
              <div class="webp icon-chain-mini icon-chain-mini-bsc" v-if="state.networkType == 'bsc'"></div>
              <div class="webp icon-chain-mini icon-chain-mini-ethereum" v-if="state.networkType == 'eth'"></div>
              <div class="color_fff ml_6 bold_700" v-hash="state.address">---</div>
            </div>
            <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
          </div>
          <div class="walletConnect gborder ml_8" @click="gotAccount" v-if="state.address">
            <div class="flex flex_center pad_2_4 gborder_container">
              <div class="my-icon my-icon-jinrong gcolor fontSize_16"></div>
              <div class="color_fff ml_6">{{ t('text.myAccount') }}</div>
            </div>
            <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
          </div>
          <div class="iconfont icon-shezhi fontSize_24 gcolor ml_12" @click="showSetting = true"></div>
        </div>
      </div>
    </div>
    <van-popup v-model:show="showSetting">
      <div class="gborder heaerbar_action_wrap">
        <div class="pad_12">
          <div class="flex flex_center justify_sb mb_12">
            <div class=""></div>
            <div class="" @click="showSetting = false">
              <van-icon name="close" class="gcolor" size="24" />
            </div>
          </div>
          <div class="pad_0_12 text-color mb_20">
            <div class="flex flex_center justify_sb">
              <div class="flex flex_center">
                <div class="my-icon my-icon-earth1 fontSize_24 gcolor"></div>
              </div>
              <div class="dropdown flex flex_center justify_sb pad_12 br_10 bg_input" @click="showLanguagePicker = true">
                <div class="title-color bold_600">{{ language }}</div>
                <div class="arrow"></div>
              </div>
            </div>
          </div>
          <div class="pad_0_12 flex flex_center text-color justify_sb mb_20">
            <div class="flex flex_center">
              <div class="my-icon my-icon-sun1 gcolor fontSize_24"></div>
              <div class="ml_8">/</div>
              <div class="my-icon my-icon-moon1 gcolor fontSize_24 ml_8"></div>
            </div>
            <div class="my-icon my-icon-moon1 gcolor fontSize_24" v-if="checked" @click="toggle()"></div>
            <div class="my-icon my-icon-sun1 gcolor fontSize_24" v-else @click="toggle()"></div>
          </div>
          <div class="pad_0_12 text-color">
            <div class="flex flex_center justify_sb">
              <div class=""></div>
              <div class="" @click="showColors = true">
                <div class="color_show gbg br_50"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pad_0_12 text-color flex flex_center justify_center mb_10 logout_btn" v-if="state.isDev">
          <div class="btn_default" @click="handleLogout">
            {{ t('text.logout') }}
          </div>
        </div>
        <div class="pad_4"></div>
        <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
      </div>
    </van-popup>
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker v-model="languageValues" :columns="languageColumns" @confirm="onLanguageConfirm" @cancel="showLanguagePicker = false" />
    </van-popup>
    <van-popup v-model:show="showColors" position="bottom" closeable>
      <div class="pad_10_0"></div>
      <div class="pad_14 colorSelect_wrap flex flex_wrap justify_sb mt_20">
        <div class="colorSelect_item br_50" v-for="(item, i) in colors" :key="i" :style="{ backgroundImage: linear(i) }" @click="handleChangeTheme(i)"></div>
      </div>
    </van-popup>
    <WalletConnect></WalletConnect>
  </div>
</template>

<script setup lang="ts" async>
import { getCurrentInstance } from 'vue';
const {
  proxy: { $forceUpdate },
}: any = getCurrentInstance();

import { Vue3Marquee } from 'vue3-marquee';
import { appName, appDescription } from '@/constants';
import type { PickerColumn } from 'vant';
import { languageColumns, locale } from '@/utils/i18n';
import { useAppStore } from '@/stores/modules';
import { useRouter, useRoute } from 'vue-router';
// import { walletConnect } from '@/utils/wallet';
import { generateRandomEthAddress, generateRandomDecimalInRange, generateFakeTronAddress } from '@/utils';
import useStateStore from '@/stores/state';
const state = useStateStore();
import { colors } from '@/utils/types/colors';
const appStore = useAppStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
import { connectWallet as connectETH, walletLogin } from '@/utils/eth';
const address = ref(state.address);
const list = ref([]);
const showSelectNetworks = ref(false);
const showSetting = ref(false);
const checked = ref<boolean>(isDark.value);
const showLanguagePicker = ref(false);
const languageValues = ref<Array<string>>([locale.value]);
const language = computed(() => languageColumns.find((l) => l.value === locale.value).text);
const loading = ref(false);
const showColors = ref(false);
function linear(v) {
  let color = colors[v];
  let str = `linear-gradient(145deg, ${color[0]}, ${color[1]} 33%, ${color[2]})`;
  return str;
}
function initList() {
  for (let i = 0; i < 100; i++) {
    let type = generateRandomDecimalInRange(1, 3, 0);
    let obj = {
      address: type != 1 ? generateRandomEthAddress() : generateFakeTronAddress(),
      quantity: type != 1 ? generateRandomDecimalInRange(0.007, 0.018, 4) : generateRandomDecimalInRange(100, 1000, 4),
      type: type,
    };
    list.value.push(obj);
  }
}
let handleChangeTheme = (v) => {
  let color = colors[v];
  document.documentElement.style.setProperty('--gradient-color1', color[0]);
  document.documentElement.style.setProperty('--gradient-color2', color[1]);
  document.documentElement.style.setProperty('--gradient-color3', color[2]);
};
function gotAccount() {
  router.push('/account');
}
let connectWallet = () => {
  walletLogin();
};
function modalClick() {
  state.setSelectNetwork(true);
}
let handleLogout = () => {
  // if (state.networkType != 'tron') {
  //   appKit.disconnect();
  // }
  localStorage.clear();
  window.location.reload();
};
watch(
  () => isDark.value,
  (newMode) => {
    checked.value = newMode;
  },
  { immediate: true }
);

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string;
  showLanguagePicker.value = false;
  showSetting.value = false;
}
function toggle() {
  toggleDark();
  appStore.switchMode(isDark.value ? 'dark' : 'light');
  document.body.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
}
onMounted(() => {
  initList();
  state.setNetwork(localStorage.network);
});
</script>

<style scoped>
.heaerbar_wrap {
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 199;
}
.header_padding {
  width: 100vw;
  height: calc(var(--base) * 85);
}
.heaerbar_action {
  background-color: var(--bg-color);
}
.header_button {
  width: 120px;
  height: 32px;
  border-radius: 16px;
}
.dropdown .arrow {
  width: 0;
  height: 0;
  margin-left: 0.21333rem;
  border-color: transparent;
  border-style: solid;
  border-width: 0.16rem;
  border-top-color: var(--title-color);
  border-bottom-width: 0;
}
.marquee_item {
  width: 100%;
}
.network_wrap {
  /* height: 55vw; */
}
.heaerbar_action_wrap {
  width: 75vw;
}
.logout_btn {
  width: 75vw;
}
.network_item {
  width: calc(var(--base) * 48);
  height: calc(var(--base) * 48);
  background-image: url('@/assets/images/tron.jpg');
  background-size: cover;
}
.network_item:nth-child(2) {
  background-image: url('@/assets/images/bsc.jpg');
}
.network_item:nth-child(3) {
  background-image: url('@/assets/images/eth.jpg');
}
.colorSelect_wrap {
  border-radius: calc(var(--base) * 12) calc(var(--base) * 12) 0 0;
}
.colorSelect_item {
  width: 18vw;
  height: 18vw;
  margin-top: 2vw;
}
.color_show {
  width: calc(var(--base) * 32);
  height: calc(var(--base) * 32);
}
</style>
