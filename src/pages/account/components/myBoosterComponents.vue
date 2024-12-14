<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.myBooster') }}</div>
    <div class="gborder br_10">
      <div class="flex flex_center justify_sb mb_12">
        <van-popover v-model:show="showPopover">
          <div class="fontSize_12 sub-title-color pad_8">
            <span>{{ t('text.requirementText') }} : </span>
            <span>{{ dataInfo.threshold }}</span>
          </div>
          <template #reference>
            <div class="flex flex_center">
              <van-icon name="question-o" size="16" />
              <div class="fontSize_16 title-color bold_700">{{ t('text.threshold') }}</div>
            </div>
          </template>
        </van-popover>
        <div class="shrink_0 fontSize_16 bold_700 red">
          <span>{{ dataInfo.threshold }}</span>
          <span class="ml_8 fontSize_14 ggolden">USDT</span>
        </div>
      </div>
      <div class="flex flex_center justify_sb mb_12">
        <van-popover v-model:show="showBalance">
          <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.daystext') }}</div>
          <template #reference>
            <div class="flex flex_center">
              <van-icon name="question-o" size="16" />
              <div class="fontSize_16 title-color bold_700">{{ t('text.days') }}</div>
            </div>
          </template>
        </van-popover>
        <div class="shrink_0 fontSize_16 bold_700 title-color">{{ dataInfo.days }} Day</div>
      </div>
      <div class="flex flex_center justify_sb mb_12">
        <van-popover v-model:show="showDailyRate">
          <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.dailyRate') }}</div>
          <template #reference>
            <div class="flex flex_center">
              <van-icon name="question-o" size="16" />
              <div class="fontSize_16 title-color bold_700">{{ t('text.dailyRate') }}</div>
            </div>
          </template>
        </van-popover>
        <div class="shrink_0 fontSize_16 bold_700 title-color" v-rate="dataInfo.dailyRate">--</div>
      </div>

      <i class="border_line border_scroll br_10"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
import useStateStore from '@/stores/state';
const state = useStateStore();
let dataInfo = ref();
const countDown = ref(null);
const showOrderNo = ref(false);
const showStatus = ref(false);
const showEndTime = ref(false);
const showStartTime = ref(false);
const showInterest = ref(false);
const showDailyRate = ref(false);
const showBalance = ref(false);
const showUserID = ref(false);
const showPopover = ref(false);
import { MyBooster } from '@/api/api';
let fetchMyBooster = () => {
  MyBooster().then((res) => {
    if (res.data) {
      dataInfo.value = res.data;
    }
  });
};
onMounted(() => {
  fetchMyBooster();
});
</script>

<style scoped>
.marquee_item {
  width: 100%;
  height: calc(var(--base) * 36);
}
</style>
