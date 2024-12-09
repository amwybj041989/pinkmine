<template>
  <div class="gborder br_10">
    <div class="pad_12">
      <div class="flex flex_center justify_sb mb_8">
        <div class="flex flex_center">
          <div class="webp icon-chain-mini icon-chain-mini-bsc shrink_0"></div>
          <div class="ml_6 title-color">Wallet Address:</div>
        </div>
        <div class="flex flex_center">
          <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0"></div>
          <div class="ml_6 fontSize_18 ggolden bold_900">0</div>
          <div class="ml_6 title-color">USDT</div>
        </div>
      </div>
      <div class="flex flex_center justify_sb mb_15">
        <div class="flex flex_center">
          <div class="fontSize_14" v-addr="address"></div>
          <div class="ml_6 my-icon my-icon-copy gcolor"></div>
        </div>
        <div class="webp icon-query-normal icon-query-normal-querylink shrink-0"></div>
      </div>
      <div class="flex flex_wrap justify_sb">
        <div class="gborder br_50 mb_12 shrink_0 amount-item" v-for="item in list" :key="item.value" :class="item.value == amount ? 'amount_item_active' : ''" @click="handleSelect(item)">
          <div class="flex flex_column flex_center justify_center">
            <strong class="fontSize_16 ggolden">{{ item.value }}</strong>
            <p><i class="webp icon-coin-mini icon-coin-mini-usdt"></i></p>
          </div>
          <i class="border_line border_scroll br_50"></i>
        </div>
      </div>
      <div class="mb_12">Recharge amount</div>
      <div class="relative bg_input pad_12 br_10 mb_20">
        <div class="van-cell__value van-field__value">
          <div class="van-field__body"><input type="text" v-model="amount" inputmode="decimal" id="van-field-20-input" class="van-field__control" placeholder="Please enter the recharge amount10~10000USDT" /></div>
        </div>
        <i data-v-6451d9cc="" class="absolute white bold_900 pad_0_8 input-btn gbg">MAX</i>
      </div>
      <div class="flex flex_center justify_center">
        <div class="btn_default">mining</div>
      </div>
      <!-- <div class="">
        <van-slider v-model="sliderValue" @change="onChange" />
      </div> -->
    </div>
    <i class="border_line border_scroll br_10"></i>
  </div>
</template>

<script setup lang="ts">
const address = '0x3ec1ee4167aad5e5de52932a64634b2871e1fc2a';
const amount = ref(10);
const sliderValue = ref(1);
const list = ref([
  {
    value: 10,
  },
  {
    value: 20,
  },
  {
    value: 30,
  },
  {
    value: 50,
  },
  {
    value: 100,
  },
  {
    value: 200,
  },
  {
    value: 500,
  },
  {
    value: 1000,
  },
]);
function onChange(v) {
  amount.value = v * 10;
}
function handleSelect(r) {
  amount.value = r.value;
  sliderValue.value = r.value / 100;
}
onMounted(() => {});
</script>

<style scoped>
.amount-item {
  width: calc(var(--base) * 74);
  height: calc(var(--base) * 74);
  background-color: #1b1b1b;
}
.amount-item div {
  height: 100%;
}
.amount_item_active {
  /* padding: calc(var(--base) * 4); */
  background-color: var(--green);
}
</style>
