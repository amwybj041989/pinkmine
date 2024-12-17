<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.mining') }}</div>
    <div class="gborder br_10">
      <div class="pad_12">
        <div class="capitalize title-color fontSize_16 mb_15 bold_700">{{ t('text.userOutput') }}</div>
        <div class="flex flex_center justify_sb fontSize_14 sub-title-color mb_15">
          <div class="">{{ t('text.address') }}</div>
          <div class="">{{ t('text.quantity') }}</div>
        </div>

        <Vue3Marquee :vertical="true" style="height: 300px; width: 100%" :duration="50">
          <div class="flex flex_center justify_sb fontSize_14 sub-title-color marquee_item" v-for="item in list" :key="item.address">
            <div class="flex flex_center">
              <div class="webp icon-chain-mini icon-chain-mini-tron shrink_0" v-if="item.type == 1"></div>
              <div class="webp icon-chain-mini icon-chain-mini-bsc shrink_0" v-if="item.type == 2"></div>
              <div class="webp icon-chain-mini icon-chain-mini-ethereum shrink_0" v-if="item.type == 3"></div>
              <div class="title-color ml_8" v-hash="item.address">----</div>
            </div>
            <div class="green flex flex_center">
              <div class="">{{ item.quantity }}</div>
              <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0 ml_8"></div>
              <!-- <span > {{ item.quantity }}</span> -->
              <!--  <span v-if="item.type == 1">TRX</span>
              <span v-if="item.type == 2">BNB</span>
              <span v-if="item.type == 3">ETH</span> -->
            </div>
          </div>
        </Vue3Marquee>
      </div>
      <i class="border_line border_scroll br_10"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import { onMounted } from 'vue';
import { generateRandomEthAddress, generateRandomDecimalInRange, generateFakeTronAddress } from '@/utils';
const { t } = useI18n();
const list = ref([]);
function initList() {
  for (let i = 0; i < 100; i++) {
    let type = generateRandomDecimalInRange(1, 3, 0);
    let obj = {
      address: type != 1 ? generateRandomEthAddress() : generateFakeTronAddress(),
      // quantity: type != 1 ? generateRandomDecimalInRange(0.007, 0.018, 8) : generateRandomDecimalInRange(100, 1000, 6),
      quantity: generateRandomDecimalInRange(100, 999, 2),
      type: type,
    };
    list.value.push(obj);
  }
}
onMounted(() => {
  initList();
});
</script>

<style scoped>
.marquee_item {
  width: 100%;
  height: calc(var(--base) * 36);
}
</style>
