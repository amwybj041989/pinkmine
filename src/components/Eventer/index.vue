<template>
  <div class="rewardList_wrap gborder relative" v-loading="eventData.title">
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
      <div class="fontSize_12 green mb_20">
        <span>{{ t('text.eventReward') }} : </span>
        <span class="fontSize_18 bold_600 ml_6 mr_6"> {{ eventData.reward }} </span>
        <span>{{ rewardCurrency[eventData.rewardCurrency] }}</span>
      </div>
      <div class="flex justify_center">
        <div class="btn_default" @click="handleJoinEvent">
          {{ t('event.joinEvent') }}
        </div>
      </div>
    </div>
    <i class="absolute white bold_900 pad_0_8 input-btn gbg fontSize_18">{{ eventData.type ? t('text.eventAirdrop') : t('text.eventStake') }}</i>
    <i class="border_line border_scroll" style="border-radius: var(--van-popup-round-radius)"></i>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { Event, JoinEvent } from '@/api/api';
import { defineEmits } from 'vue';
const emit = defineEmits(['close', 'join']);
import { showNotify } from 'vant';
import currencyEnum from '@/utils/types/currencyEnum';
import { connect as tronConnect, tokenBalance as tronToken } from '@/utils/tron';
import { connectWallet as ethConnect, checkNeedEth, tokenApprove } from '@/utils/eth';
let rewardCurrency = ref(currencyEnum);
let eventData = ref({});
let handleJoinEvent = () => {
  // if(eventData.value.rewardCurrency==4){
  //   tronConnect().then(()=>{
  //     tronToken().then(token=>{
  //       console.log(token);
  //     })
  //   })
  //   return
  // }
  // if()
  console.log(eventData.value);
  emit('join', eventData.value);
};
let fetchData = () => {
  Event().then((res) => {
    eventData.value = res.data;
    console.log('fetchData', res);
  });
};
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.rewardList_wrap {
  width: 75vw;
  /* min-height: 20px; */
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}
.rewardList {
  flex: 1;
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
