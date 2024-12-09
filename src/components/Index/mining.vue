<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">Mining</div>
    <div class="gborder br_10">
      <div class="pad_12">
        <div class="capitalize title-color fontSize_16 mb_15 bold_700">User output</div>
        <div class="flex flex_center justify_sb fontSize_14 sub-title-color mb_15">
          <div class="">Address</div>
          <div class="">Quantity</div>
        </div>

        <Vue3Marquee :vertical="true" style="height: 300px; width: 100%" :duration="50">
          <div class="flex flex_center justify_sb fontSize_14 sub-title-color marquee_item" v-for="item in list" :key="item.address">
            <div class="flex flex_center">
              <div class="yellow" v-address="item.address">----</div>
            </div>
            <div class="">{{ item.quantity }} ETH</div>
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
