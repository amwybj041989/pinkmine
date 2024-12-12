<template>
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
let eventData = ref({
  id: 1,
  type: 0,
  title: '江西妈妈办小饭堂，每月一个人收500元，客人：比吃预制菜强多了',
  content:
    '爱在日常的餐桌间体现，母爱如山厚。江西38岁的云大姐正是如此，为了让孩子们吃得健康满意，她在背后付出的是旁人难以想象的辛劳。许多孩子喜欢到云大姐家吃饭，因为她总是坚持用新鲜的食材做饭。每天她都会采购新鲜的食材，为孩子们准备几道荤菜、几道素菜，还特地煲汤。孩子们吃得开心，她也乐在其中。云大姐专门买来新鲜的鸡肉，这些鸡肉显得特别扎实，与冰鲜鸡完全不同。她把鸡肉切成大块，经过翻炒后加入酱料和辣椒焖煮，鸡肉色泽深沉，咸淡适中，口感入味，每一口都带着微微的辣味，特别符合江西人的口味。',
  requirement: 19232.22,
  rewardCurrency: 1,
  reward: 113.123,
  deposited: 1231.2,
  status: 0,
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
</style>
