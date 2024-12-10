<template>
  <van-tabs v-model:active="active" background="transparent" title-active-color="var(--gradient-color1)" @change="onChange">
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-shujuku" :class="active == 0 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 0 ? 'gcolor' : ''">{{ t('text.poolData') }}</div>
        </div>
      </template>
      <div class="text-color text_center">{{ t('text.poolData') }}</div>
      <div class="text-color text_center">
        <van-count-down :time="121 * 1000" @finish="onFinish" ref="countDown">
          <template #default="timeData">
            <span class="mr_8 text-color fontSize_12">{{ t('text.refreshTime') }}：</span>
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
          <div class="ml_8" :class="active == 1 ? 'gcolor' : ''">{{ t('text.trendChart') }}</div>
        </div>
      </template>
      <div class="text-color mb_8 fontSize_16">{{ t('text.trendChart') }}</div>
      <div class="mb_12">
        <span class="fontSize_18 ggolden bold_600">$ <span ref="finace"></span></span>
        <span class="green"> +{{ upValue }}% </span>
      </div>
      <div class="gborder">
        <Chart :option="refLineOption" :style="{ height: '250px' }" />
        <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
      </div>
    </van-tab>
    <!-- <van-tab>
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
    </van-tab> -->
  </van-tabs>
</template>

<script setup lang="ts">
import { animateNumber, observeVisibility } from '@/utils';
import { initPoolData, clearPoolData, initTrendData } from '@/utils/mock';
import { bigNum } from '@/utils';
import * as echarts from 'echarts';
const { t } = useI18n();
const active = ref(1);
const nowValue = ref(0);
const upValue = ref(0);

const countDown = ref(null);
const finace = ref(null);

const lineOption = {
  grid: {
    // left: 15,
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  xAxis: {
    data: ['96H', '72H', '48H', '24H', 'NOW'],
    axisTick: {
      alignWithLabel: true,
    },
    type: 'category',
    axisLabel: {
      textStyle: {
        color: '#3bd04a',
      },
    },
  },
  tooltip: {
    trigger: 'item',
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      textStyle: {
        color: '#3bd04a',
      },
    },
  },
  series: [
    {
      data: [],
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
    // {
    //   data: [],
    //   type: 'line',
    //   smooth: true,
    //   emphasis: {
    //     focus: 'series',
    //   },
    // },
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
        str = `${data.name} : ${bigNum(data.value)} ${data.text}`;
      } else {
        str = `${data.name} : ${bigNum(data.value)}`;
      }
      return str;
    },
  },
  series: [
    {
      name: t('text.poolData'),
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      label: {
        alignTo: 'edge',
        formatter: function (params) {
          let data = params.data;
          let str = ``;
          if (data.text) {
            str = `${data.name} \n ${bigNum(data.value)} ${data.text}`;
          } else {
            str = `${data.name} \n ${bigNum(data.value)}`;
          }
          return str;
        },
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 15,
        rich: {
          time: {
            fontSize: 10,
            color: '#999',
          },
        },
      },
      labelLine: {
        length: 15,
        length2: 0,
        maxSurfaceAngle: 80,
      },
    },
  ],
};
const refPieOption = ref(pieOption);
const refLineOption = ref(lineOption);
function initPieOption() {
  let data = initPoolData();
  refPieOption.value.series[0].data = [
    { value: data.totalOutput, name: t('text.totalOutput'), text: 'ETH' },
    { value: data.validNode, name: t('text.validNode') },
    { value: data.participant, name: t('text.participant') },
    { value: data.userRevenue, name: t('text.userRevenue'), text: 'USDT' },
  ];
}
function initLineOption() {
  let data = initTrendData();
  console.log(data);
  refLineOption.value.series[0].data = data.list;
  nowValue.value = data.now * 1;
  // if (active.value == 1) {
  //   animateNumber(finace.value, 0, nowValue.value, 1500);
  // }
  upValue.value = parseFloat(data.up).toFixed(6);
}
function onFinish() {
  clearPoolData();
  nextTick(() => {
    countDown.value.reset();
    initPieOption();
    initLineOption();
  });
}
function handleVisibilityChange(isVisible, entry) {
  console.log('handleVisibilityChange');
  if (isVisible) {
    nextTick(() => {
      if (finace.value) {
        animateNumber(finace.value, 0, nowValue.value, 1500);
      } else {
        // console.error('targetElement ref is not bound to a DOM element');
      }
    });
  } else {
    // console.log('#targetElement is not visible');
  }
}
function onChange(v) {
  console.log(finace);
  if (v == 1) {
    animateNumber(finace.value, 0, nowValue.value, 1500);
  }
}
onMounted(() => {
  initPieOption();
  initLineOption();
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
