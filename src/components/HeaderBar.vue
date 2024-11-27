<template>
  <div class="">
    <div class="heaerbar_wrap">
      <div class="gbg pad_12">
        <Vue3Marquee>
          <div class="">11111111111111</div>
          <div class="">22222222</div>
        </Vue3Marquee>
      </div>
      <div class="heaerbar_action pad_8 flex flex_center justify_sb">
        <div class="logo_title fontSize_20 gcolor light" data-text="HashGameFi">HashGameFi</div>
        <div class="flex flex flex_center">
          <div class="walletConnect gborder">
            <div class="flex flex_center pad_2_4 gborder_container">
              <div class="webp icon-chain-mini icon-chain-mini-bsc"></div>
              <div class="color_fff ml_6">0x3E***Fc2A</div>
            </div>
            <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
          </div>
          <div class="iconfont icon-shezhi fontSize_24 gcolor ml_12" @click="showSetting = true"></div>
        </div>
      </div>
    </div>
    <van-popup v-model:show="showSetting">
      <div class="gborder">
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
                <div class="ml_12">{{ t('menus.language') }}</div>
              </div>
              <div class="dropdown flex flex_center justify_sb pad_12 br_10 bg_input" @click="showLanguagePicker = true">
                <div class="title-color bold_600">{{ language }}</div>
                <div class="arrow"></div>
              </div>
            </div>
          </div>
          <div class="pad_0_12 flex flex_center text-color justify_sb">
            <div class="flex flex_center">
              <div class="my-icon my-icon-sun1 gcolor fontSize_24"></div>
              <div class="ml_8">Day /</div>
              <div class="my-icon my-icon-moon1 gcolor fontSize_24 ml_8"></div>
              <div class="ml_8">Ninght</div>
            </div>
            <div class="my-icon my-icon-moon1 gcolor fontSize_24" v-if="checked" @click="toggle()"></div>
            <div class="my-icon my-icon-sun1 gcolor fontSize_24" v-else @click="toggle()"></div>
          </div>
        </div>
        <div class="pad_4"></div>
        <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
      </div>
    </van-popup>
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker v-model="languageValues" :columns="languageColumns" @confirm="onLanguageConfirm" @cancel="showLanguagePicker = false" />
    </van-popup>
    -->
  </div>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import type { PickerColumn } from 'vant';
import { languageColumns, locale } from '@/utils/i18n';
import useAppStore from '@/stores/modules/app';
const appStore = useAppStore();
const showSetting = ref(false);
const checked = ref<boolean>(isDark.value);
const { t } = useI18n();
const showLanguagePicker = ref(false);
const languageValues = ref<Array<string>>([locale.value]);
const language = computed(() => languageColumns.find((l) => l.value === locale.value).text);

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
}
function toggle() {
  toggleDark();
  appStore.switchMode(isDark.value ? 'dark' : 'light');
}
onMounted(() => {
  console.log(isDark.value);
});
</script>

<style scoped>
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
</style>
