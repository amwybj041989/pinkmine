<template>
  <div class="">
    222222
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.myEventDetail') }}</div>
    <div class="gborder br_10">
      <div class="fontSize_14 pad_12">
        <div class="text-color uppercase mb_8">{{ t('text.profitText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <span v-if="userInfo.profit"> <span v-bigNum="userInfo.profit"></span> <span>USDT</span></span>
          <span v-else>{{ t('text.waitOut') }}</span>
        </div>
        <div class="text-color uppercase mb_8 flex flex_center">{{ t('text.canWithdrawText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <span v-if="userInfo.canWithdraw"> <span v-bigNum="userInfo.profit"></span> <span>USDT</span></span>
          <span v-else>{{ t('text.waitOut') }}</span>
        </div>
        <div class="text-color uppercase mb_8 flex flex_center">{{ t('text.rateText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12" v-rate="userInfo.rate">--</div>
        <div class="text-color uppercase mb_8 flex flex_center justify_sb" @click="handleGoRecord">
          <div class="">{{ t('text.lastProfitTime') }}</div>
          <div class="gcolor fontSize_14 bold_600">{{ t('text.record') }} ></div>
        </div>
        <div class="">
          <van-count-down :time="userInfo.coutDownTime" ref="countDown">
            <template #default="timeData">
              <div class="gcolor fontSize_18 bold_700 mb_12" v-if="userInfo.coutDownTime > 0">
                <span>{{ timeData.hours }}</span>
                <span>:</span>
                <span>{{ timeData.minutes }}</span>
                <span>:</span>
                <span>{{ timeData.seconds }}</span>
              </div>
              <div class="red" v-else>
                {{ t('text.noProfitText') }}
              </div>
            </template>
          </van-count-down>
        </div>
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
import { Event, EventDetail } from '@/api/api';
let eventInfo = ref({});
let handleGoRecord = () => {
  router.push({
    path: '/records',
    query: {
      type: 'profit',
    },
  });
};
let fetchEvent = () => {
  Event().then((res) => {
    if (res.data) {
      EventDetail({ id: res.data.id }).then((detail) => {
        if (detail.data) {
          eventInfo.value = detail.data;
        }
      });
    }
  });
};
onMounted(() => {
  fetchEvent();
});
</script>

<style scoped>
.marquee_item {
  width: 100%;
  height: calc(var(--base) * 36);
}
</style>
