<template>
  <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.myEventDetail') }}</div>
  <div class="rewardList_wrap gborder relative">
    <div class="pad_14">
      <div class="gcolor fontSize_14 bold_700 text_center line_15 mb_20">
        {{ eventData.title }}
      </div>
      <div class="line_15 fontSize_12 sub-text-color mb_10">
        {{ eventData.content }}
      </div>
      <div class="flex flex_center justify_sb">
        <div class="">
          <div class="fontSize_12 red mb_10">
            <!-- <span>{{ t('text.requirement') }} : {{ t('text.requirementText') }}</span> -->
            <span>{{ t('text.requirement') }} : </span>
            <span class="fontSize_18 bold_600 ml_6 mr_6"> {{ eventData.requirement }} </span>
            <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
          </div>
          <div class="fontSize_12 red mb_10" v-if="eventData.requirement != eventData.deposited">
            <span>{{ t('text.eventDiff') }} : </span>
            <span class="fontSize_18 bold_600 ml_6 mr_6 red"> {{ eventData.requirement - eventData.deposited }} </span>
            <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
          </div>
          <div class="fontSize_12 green mb_10">
            <span>{{ t('text.eventDeposited') }} : </span>
            <span class="fontSize_18 bold_600 ml_6 mr_6 ggolden"> {{ eventData.deposited }} </span>
            <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
          </div>
          <div class="fontSize_12 green mb_10">
            <span>{{ t('text.eventReward') }} : </span>
            <span class="fontSize_18 bold_600 ml_6 mr_6"> {{ eventData.reward }} </span>
            <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
          </div>
        </div>
        <van-circle v-model:current-rate="currentRate" :rate="currentRate" :speed="100" :stroke-width="100" :color="gradientColor">
          <template #default>
            <div class="text_center flex flex_column justify_center circle_text">
              <div class="red fontSize_14 bold_600">
                {{ eventData.requirement - eventData.deposited }}
              </div>
              <div class="">
                {{ rewardCurrency[eventData.rewardCurrency] }}
              </div>
            </div>
          </template>
        </van-circle>
      </div>

      <div class="fontSize_12 green mb_10">
        <span>{{ t('text.depositedStatus') }} : </span>
        <span class="fontSize_14 bold_600 ml_6 mr_6"> {{ eventData.status ? t('text.deposited') : t('text.depositing') }} </span>
      </div>
    </div>
    <i class="absolute white bold_900 pad_0_8 input-btn gbg fontSize_18">{{ eventData.type ? t('text.eventAirdrop') : t('text.eventStake') }}</i>
    <i class="border_line border_scroll" style="border-radius: var(--van-popup-round-radius)"></i>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { Event, EventDetail } from '@/api/api';
import { defineEmits } from 'vue';
const emit = defineEmits(['join']);
import { showNotify } from 'vant';
import currencyEnum from '@/utils/types/currencyEnum';
let rewardCurrency = ref(currencyEnum);

const gradientColor = {
  '0%': 'var(--gradient-color1)',
  '50%': 'var(--gradient-color2)',
  '100%': 'var(--gradient-color3)',
};
let eventData = ref({
  // title: '大理女房东，一棵玉树养了18年',
  // content: '1900 年，美国・旧金山唐人街，阿鬼（王宝强饰）与秦福（刘昊然饰）因为一起凶杀案偶然结识，误打误撞组成“唐人街神探”组合，一场精彩又刺激的笑闹探案就此展开……',
  // requirement: 20000,
  // rewardCurrency: 2,
  // deposited: 333,
  // reward: 35,
  // status: 0,
});
let currentRate = ref((eventData.value.deposited / eventData.value.requirement) * 100);

console.log(eventData.value.deposited / eventData.value.requirement);
let text = computed(() => {
  let calc = eventData.value.requirement - eventData.value.deposited;
  let unit = rewardCurrency.value[eventData.value.rewardCurrency];
  return calc + '' + unit;
});
let handleJoinEvent = () => {
  emit('join', eventData.value);
};
let fetchData = () => {
  Event().then((res) => {
    EventDetail({
      id: res.data.id,
    }).then((detail) => {
      eventData.value = detail.data;
    });
    console.log('fetchData', res);
  });
};
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.rewardList_wrap {
  width: 100%;
  max-height: 75vh;
}
.rewardList {
  width: 100%;
  max-height: 100%;
  overflow-y: scroll;
}
.rewardList_item + .rewardList_item {
  margin-top: calc(var(--base) * 12);
}
.input-btn {
}
.circle_text {
  width: 100%;
  height: 100%;
}
</style>
