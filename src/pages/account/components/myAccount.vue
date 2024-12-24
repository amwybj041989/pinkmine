<template>
  <div class="">
    <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.myAccount') }}</div>
    <div class="gborder br_10">
      <div class="fontSize_14 pad_12">
        <!-- <div class="text-color uppercase mb_8">{{ t('text.profitText') }}</div> -->
        <div class="flex flex_center justify_sb mb_8">
          <div class="text-color uppercase">{{ t('text.walletBalance') }}</div>
          <!-- <div class="gcolor fontSize_14 bold_600">{{ t('text.charge') }} ></div> -->
        </div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <div class="flex flex_center green">
            <div class="mr_8" v-bigNum="balance"></div>
            <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0"></div>
          </div>
        </div>
        <div class="text-color uppercase mb_8">{{ t('text.poolBalance') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <div class="flex flex_center green">
            <div class="mr_8" v-bigNum="state.userInfo.MineBalance"></div>
            <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0"></div>
            <!-- <div class="webp icon-chain-mini icon-chain-mini-tron" v-if="state.networkType == 'tron'"></div>
            <div class="webp icon-chain-mini icon-chain-mini-bsc" v-if="state.networkType == 'bsc'"></div>
            <div class="webp icon-chain-mini icon-chain-mini-ethereum" v-if="state.networkType == 'eth'"></div> -->
          </div>
        </div>
        <div class="text-color uppercase mb_8">{{ t('text.profitText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <div class="flex flex_center green" v-if="state.userInfo.profit">
            <div class="" v-bigNum="state.userInfo.profit"></div>
            <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0 ml_8"></div>
          </div>
          <span v-else>{{ t('text.waitOut') }}</span>
        </div>
        <div class="text-color uppercase mb_8 flex flex_center">{{ t('text.canWithdrawText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12">
          <div class="flex flex_center green" v-if="state.userInfo.canWithdraw">
            <div class="" v-bigNum="state.userInfo.canWithdraw"></div>
            <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0 ml_8"></div>
          </div>
          <!--  <span v-if="userInfo.canWithdraw" class="green">
            <span v-bigNum="state.userInfo.canWithdraw"></span>
            <span class="ml_8">USDT</span>
            <span>{{ state.walletToken }}</span>
          </span> -->
          <span v-else>{{ t('text.waitOut') }}</span>
        </div>
        <div class="text-color uppercase mb_8 flex flex_center">{{ t('text.rateText') }}</div>
        <div class="gcolor fontSize_18 bold_700 mb_12" v-rate="userInfo.rate">--</div>
        <div class="text-color uppercase mb_8 flex flex_center justify_sb" @click="handleGoRecord">
          <div class="">{{ t('text.lastProfitTime') }}</div>
          <div class="gcolor fontSize_14 bold_600">{{ t('text.record') }} ></div>
        </div>
        <div class="" @click="handleGoRecord">
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
import { modalOopen, appKit } from '@/utils/modal';
import { connect as tronConnect, tokenBalance as tronToken } from '@/utils/tron';
import { connectWallet as ethConnect, tokenBalance as ethToken } from '@/utils/eth';
import { chargeList } from '@/utils';
let userInfo = ref(state.userInfo);
const countDown = ref(null);
const balance = ref(0);
watch(
  () => userInfo,
  (newMode) => {
    if (newMode.value.coutDownTime) {
      // countDown.value.start();
    }
  },
  { immediate: true }
);
let handleGoCharge = () => {
  let network = state.networkType;
  window.open(chargeList[network]);
};
let handleGoRecord = () => {
  router.push({
    path: '/records',
    query: {
      type: 'profit',
    },
  });
};
onMounted(() => {
  if (state.loginStatus) {
    state.fetchUserInfo();
    if (state.networkType == 'tron') {
      tronConnect(() => {
        tronToken().then((res) => {
          balance.value = res;
        });
      });
      return;
    }
    ethConnect().then(() => {
      ethToken().then((res) => {
        balance.value = res;
        console.log(res);
      });
    });
    console.log();
  }
});
</script>

<style scoped>
.marquee_item {
  width: 100%;
  height: calc(var(--base) * 36);
}
</style>
