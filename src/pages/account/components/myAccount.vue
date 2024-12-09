<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">my account</div>
    <div class="gborder br_10">
      <div class="fontSize_14 pad_12">
        <div class="text-color uppercase mb_8">所有地址的數量</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">120,364</div>
        <div class="text-color uppercase mb_8 flex flex_center"><i class="icon-chain-mini icon-chain-mini-bsc mr_8"></i>BSC 網路位址數量</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">120,364</div>
        <div class="text-color uppercase mb_8 flex flex_center"><i class="icon-chain-mini icon-chain-mini-ethereum mr_8"></i> ethereum 網路位址數量</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">120,364</div>
        <div class="text-color uppercase mb_8">遊戲資金池總價值</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">120,364</div>
        <div class="text-color uppercase mb_8">遊戲池總價值</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">120,364</div>
        <div class="text-color uppercase mb_8">掉期池總價值</div>
        <div class="gcolor fontSize_18 bold_700">120,364</div>
      </div>
      <i class="border_line border_scroll br_10"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Vue3Marquee } from 'vue3-marquee';
import { onMounted } from 'vue';
import { generateRandomEthAddress, generateRandomDecimalInRange } from '@/utils';

const list = ref([]);
function initList() {
  for (let i = 0; i < 100; i++) {
    let obj = {
      address: generateRandomEthAddress(),
      quantity: generateRandomDecimalInRange(0.07, 0.18, 8),
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
