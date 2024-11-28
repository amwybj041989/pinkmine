<template>
  <HeaderBar></HeaderBar>
  <div class="vuemarquee_padding"></div>
  <div class="pad_12">
    <div class="gtext fontSize_30 bold_700 text_center gcolor mb_15">Web 3.0 Block Hash Ecosystem</div>
    <div class="sub-text-color line_15 text_center mb_20">
      Web3.0 Blockchain (Block Hash) Games, Investments, Swap, Task, Open, Transparent, Anonymous, Trustworthy and Innovative. Create an integrated decentralized ecological environment Ecosystem. Everyone can gain wealth on this Ecosystem! Invite
      your friends to join and get generous Bonus!
    </div>
    <indexTabs></indexTabs>
  </div>
  <!--
  <VanCellGroup :title="t('menus.exampleComponents')" :border="false" :inset="true">
    <template v-for="item in menuItems" :key="item.route">
      <VanCell :title="item.title" :to="item.route" is-link />
    </template>
  </VanCellGroup>

  <van-popup v-model:show="showLanguagePicker" position="bottom">
    <van-picker v-model="languageValues" :columns="languageColumns" @confirm="onLanguageConfirm" @cancel="showLanguagePicker = false" />
  </van-popup> -->
</template>

<script setup lang="ts">
const { t } = useI18n();
import indexTabs from '@/components/Index/indexTabs.vue';
import useAppStore from '@/stores/modules/app';
import { languageColumns, locale } from '@/utils/i18n';
const appStore = useAppStore();
const checked = ref<boolean>(false);

onMounted(() => {});
</script>

<style scoped>
.color {
  background-color: transparent;
}
</style>
