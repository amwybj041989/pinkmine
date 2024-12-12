<template>
  <div class="pad_12">
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showPopover">
        <div class="fontSize_12 sub-title-color pad_8">
          <span>{{ t('text.requirementText') }} : </span>
          <span>{{ data.threshold }}</span>
        </div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">threshold</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 red">
        <span>{{ data.threshold }}</span>
      </div>
    </div>
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showBalance">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.daystext') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">days</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 title-color">{{ data.days }} Day</div>
    </div>
    <div class="flex flex_center justify_sb mb_12">
      <van-popover v-model:show="showDailyRate">
        <div class="fontSize_12 sub-title-color pad_8">{{ t('reward.dailyRate') }}</div>
        <template #reference>
          <div class="flex flex_center">
            <van-icon name="question-o" size="16" />
            <div class="fontSize_16 title-color bold_700">dailyRate</div>
          </div>
        </template>
      </van-popover>
      <div class="shrink_0 fontSize_16 bold_700 title-color">
        {{ data.dailyRate }}
      </div>
    </div>

    <div class="flex flex_center justify_center" v-if="data.canClaim" @click="handleClaim">
      <div class="shrink_0 btn_default">
        {{ t('reward.button') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { defineEmits } from 'vue';
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
