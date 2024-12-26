<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.partner') }}</div>
    <div class="fontSize_14 sub-title-color text_center mb_15">{{ t('text.partnerSub') }}</div>
    <div class="pad_4">
      <div class="flex flex_wrap justify_sb">
        <div class="partner_item partner_item_bg flex flex_center justify_center br_4" v-for="(item, i) in partner" :key="i" :class="item.name ? '' : ''" @click="handleGo(item)">
          <div class="icon_18 partner_item_icon br_50" :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
          <div class="fontSize_12 capitalize title-color ml_6">
            {{ item.name }}
          </div>
        </div>
        <div class="partner_item">

        </div>
        <!--  <div class="audit_item audit_bg1"></div>
        <div class="audit_item audit_bg2"></div>
        <div class="audit_item audit_bg3"></div>
        <div class="audit_item audit_bg4"></div>
        <div class="audit_item audit_bg5"></div>
        <div class="audit_item"></div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { getAssetsFile } from '@/utils';
const activeNames = ref('1');
let partner = ref([
  {
    icon: getAssetsFile('wallets/meta.webp'),
    name: 'metamask',
    link: 'https://metamask.io/',
  },
  {
    icon: getAssetsFile('wallets/binance.webp'),
    name: 'binance wallet',
    link: 'https://www.binance.com/en/web3wallet',
  },
  {
    icon: getAssetsFile('wallets/bitge.webp'),
    name: 'bitget',
    link: 'https://www.bitget.com/',
  },
  {
    icon: getAssetsFile('wallets/crypto.webp'),
    name: 'crypto',
    link: 'https://crypto.com/',
  },
  {
    icon: getAssetsFile('wallets/coinbase.png'),
    name: 'coinbase',
    link: 'https://www.coinbase.com/',
  },
  {
    icon: getAssetsFile('wallets/safe.webp'),
    name: 'safePal',
    link: 'https://safepal.com',
  },
  {
    icon: getAssetsFile('wallets/kucoin.png'),
    name: 'kuCoin',
    link: 'https://www.kucoin.com/',
  },
  {
    icon: getAssetsFile('wallets/kraken.webp'),
    name: 'kraken',
    link: 'https://www.kraken.com/',
  },
]);
let handleGo = (r) => {
  window.open(item.link);
};
onMounted(() => {});
</script>

<style scoped>
.audit_item {
  width: 100px;
  height: 36px;
  background-size: cover;
  /* margin-top: calc(var(--base) * 12); */
}
.audit_item:not(:nth-child(-n + 3)) {
  margin-top: calc(var(--base) * 12);
}
.audit_bg1 {
  background-image: url('@/assets/images/partner/partner1.png');
}
.audit_bg2 {
  background-image: url('@/assets/images/partner/partner2.png');
}
.audit_bg3 {
  background-image: url('@/assets/images/partner/partner3.png');
}
.audit_bg4 {
  background-image: url('@/assets/images/partner/partner4.png');
}
.audit_bg5 {
  background-image: url('@/assets/images/partner/partner5.png');
}
.partner_item {
  width: 32%;
  height: 36px;
  margin-bottom: calc(var(--base) * 12);
}
.partner_item_bg{
  background-color: rgba(0, 0, 0, 0.05);
}
.partner_item_icon {
  background-size: cover;
}
</style>
