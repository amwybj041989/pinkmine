<template>
  <div class="pad_12">
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showPopover">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.orderNo') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">{{ t('text.orderNo') }}</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 title-color">
        {{ data.orderNo }}
      </div>
    </div>
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showBalance">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.balance') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">{{ t('text.balance') }}</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 title-color">
        {{ data.balance }} <span>{{ state.walletToken }}</span>
      </div>
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
      <div class="shrink_0 fontSize_16 bold_700 title-color" v-rate="data.dailyRate">--</div>
    </div>
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showInterest">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.interest') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">{{ t('text.interest') }}</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 title-color">
        {{ data.interest }}
      </div>
    </div>
    <div class="flex flex_center justify_sb mb_12">
      <div class=""></div>
      <!-- <van-popover v-model:show="showStatus">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.status') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">status</div>
          </div>
        </template>
      </van-popover> -->
      <div class="shrink_0 btn_default" v-if="!data.status" @click="handleClaim">
        {{ t('reward.button') }}
      </div>
      <!-- <div class="shrink_0 fontSize_16 bold_700 title-color">
        {{ data.status ? t('reward.Claimed') : t('reward.noClaim') }}
      </div> -->
    </div>
    <!-- <div class="flex flex_center justify_center"  >
      <div class="shrink_0 btn_default">
        {{ t('reward.button') }}
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
import useStateStore from '@/stores/state';
const state = useStateStore();
const emit = defineEmits(['claim']);
const { t } = useI18n();
const showOrderNo = ref(false);
const showStatus = ref(false);
const showEndTime = ref(false);
const showStartTime = ref(false);
const showInterest = ref(false);
const showDailyRate = ref(false);
const showBalance = ref(false);
const showUserID = ref(false);
const showPopover = ref(false);
const props = defineProps({
  data: Object,
});
function handleClaim() {
  emit('claim');
  // ClaimReward({
  //   idList: [data.id],
  // }).then(res=>{

  // })
}
onMounted(() => {});
</script>

<style scoped></style>
