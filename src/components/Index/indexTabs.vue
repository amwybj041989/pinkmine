<template>
  <van-tabs v-model:active="active" background="transparent" title-active-color="var(--gradient-color1)">
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-shujuku" :class="active == 0 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 0 ? 'gcolor' : ''">Pool Data</div>
        </div>
      </template>
      <div class="text-color text_center">Pool Data</div>
      <div class="text-color text_center">
        <van-count-down :time="120 * 1000" @end="onEnd" ref="countDown">
          <template #default="timeData">
            <span class="mr_8 text-color fontSize_12">刷新剩餘時間：</span>
            <span class="text-color fontSize_12">{{ timeData.minutes }}</span>
            <span class="text-color fontSize_12">:</span>
            <span class="text-color fontSize_12">{{ timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
      <Chart :option="refPieOption" :style="{ height: '250px' }" />
    </van-tab>
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-zhexiantu" :class="active == 1 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 1 ? 'gcolor' : ''">Pool Data</div>
        </div>
      </template>
      <div class="text-color mb_8 fontSize_16">資金池走勢圖</div>
      <div class="mb_12">
        <span class="fontSize_18 ggolden bold_600">$ <span ref="finace"></span></span>
        <span class="green"> +0.0007% </span>
      </div>
      <div class="gborder">
        <Chart :option="refLineOption" :style="{ height: '250px' }" />
        <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
      </div>
    </van-tab>
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-shuju" :class="active == 2 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 2 ? 'gcolor' : ''">Pool Data</div>
        </div>
      </template>
      <div class="fontSize_14">
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
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import { animateNumber, observeVisibility } from '@/utils';
const { t } = useI18n();
const active = ref(1);
const countDown = ref(null);
const finace = ref(null);

const lineOption = {
  xAxis: {
    type: 'category',
    data: ['96H', '72H', '48H', '24H', 'NOW'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135],
      type: 'line',
    },
  ],
};
const pieOption = {
  title: {},
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      let data = params.data;
      let str = ``;
      if (data.text) {
        str = `${data.name} : ${data.value} ${data.text}`;
      } else {
        str = `${data.name} : ${data.value}`;
      }
      return str;
    },
  },
  series: [
    {
      name: 'Pool Data',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Total output', text: 'ETH' },
        { value: 735, name: 'Valid node' },
        { value: 580, name: 'Participant' },
        { value: 300, name: 'User Revenue', text: 'USDT' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};

const refPieOption = ref(pieOption);
const refLineOption = ref(lineOption);
function onEnd() {
  console.log('onEnd');
  countDown.value.reset();
}
function handleVisibilityChange(isVisible, entry) {
  if (isVisible) {
    nextTick(() => {
      if (finace.value) {
        animateNumber(finace.value, 0, 1233519699.366184, 1500);
      } else {
        console.error('targetElement ref is not bound to a DOM element');
      }
    });
  } else {
    console.log('#targetElement is not visible');
  }
}
onMounted(() => {
  console.log(finace.value);
  nextTick(() => {
    if (finace.value) {
      observeVisibility(finace.value, handleVisibilityChange);
    } else {
      console.error('targetElement ref is not bound to a DOM element');
    }
  });
});
</script>

<style scoped></style>
