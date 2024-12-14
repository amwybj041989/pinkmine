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
      <div class="fontSize_12 red mb_10">
        <span>{{ t('text.requirement') }} : {{ t('text.requirementText') }}</span>
        <span class="fontSize_18 bold_600 ml_6 mr_6"> {{ eventData.requirement }} </span>
        <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
      </div>
      <div class="fontSize_12 green mb_10">
        <span>{{ t('text.eventReward') }} : </span>
        <span class="fontSize_18 bold_600 ml_6 mr_6"> {{ eventData.reward }} </span>
        <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
      </div>
      <div class="fontSize_12 green mb_10">
        <span>{{ t('text.depositedText') }} : </span>
        <span class="fontSize_18 bold_600 ml_6 mr_6 ggolden"> {{ eventData.deposited }} </span>
        <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
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
let eventData = ref({});
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
</style>
