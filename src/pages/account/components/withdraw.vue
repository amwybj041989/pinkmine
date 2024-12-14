<template>
  <div class="gborder br_10">
    <div class="pad_12">
      <div class="flex flex_center justify_sb mb_8">
        <div class="flex flex_center">
          <!-- <div class="webp icon-chain-mini icon-chain-mini-bsc shrink_0"></div> -->
          <div class="ml_6 title-color">{{ t('text.walletAddress') }}:</div>
        </div>
        <div class="flex flex_center">
          <div class="webp icon-coin-mini icon-coin-mini-usdt shrink_0"></div>
          <div class="ml_6 fontSize_18 ggolden bold_900"><span v-bigNum="userinfo.canWithdraw"></span></div>
          <div class="ml_6 title-color">USDT</div>
        </div>
      </div>
      <div class="flex flex_center justify_sb mb_15">
        <div class="flex flex_center" @click="handleCopyAdress">
          <div class="fontSize_14" v-addr="state.address"></div>
          <div class="ml_6 my-icon my-icon-copy gcolor"></div>
        </div>
      </div>
      <div class="" v-if="withdrawConfig.withdrawable">
        <div class="mb_12">{{ t('text.withdrawAmount') }}</div>
        <div class="relative bg_input pad_12 br_10 mb_10">
          <div class="van-cell__value van-field__value">
            <div class="van-field__body"><input type="text" v-model="amount" inputmode="decimal" id="van-field-20-input" class="van-field__control" :placeholder="withdrawConfig.withdrawMin + ' - 10000'" /></div>
          </div>
          <i data-v-6451d9cc="" class="absolute white bold_900 pad_0_8 input-btn gbg" @click="handleClickMax">MAX</i>
        </div>
        <div class="mb_20 green">
          <div class="mb_12">
            <van-popover v-model:show="showWithdrawFee">
              <div class="fontSize_12 sub-title-color pad_8">{{ t('text.withdrawFeeTip') }}</div>
              <template #reference>
                <div class="flex flex_center justify_sb">
                  <div class="flex flex_center">
                    <van-icon name="question-o" size="16" />
                    <div class="fontSize_14 title-color bold_700">{{ t('text.withdrawFee') }}</div>
                  </div>
                  <div class="shrink_0 fontSize_16 bold_700 title-color">
                    {{ withdrawConfig.withdrawFee }}
                  </div>
                </div>
              </template>
            </van-popover>
          </div>
          <div class="mb_12">
            <van-popover v-model:show="showWithdrawFree">
              <div class="fontSize_12 sub-title-color pad_8">{{ t('text.withdrawFreeTip') }}</div>
              <template #reference>
                <div class="flex flex_center justify_sb">
                  <div class="flex flex_center">
                    <van-icon name="question-o" size="16" />
                    <div class="fontSize_14 title-color bold_700">{{ t('text.withdrawFree') }}</div>
                  </div>
                  <div class="shrink_0 fontSize_16 bold_700 title-color">
                    {{ withdrawConfig.withdrawFree }}
                  </div>
                </div>
              </template>
            </van-popover>
          </div>
          <div class="">
            <!-- <div class="flex flex_center mb_12">
              <div class="fontSize_14 title-color bold_700">{{ t('text.withdrawInfo') }}</div>
            </div> -->
            <div class="shrink_0 fontSize_14 bold_700 red line_15">
              {{ withdrawConfig.withdrawFree }}
            </div>
          </div>
        </div>
        <div class="flex flex_center justify_center" @click="handleWithdraw">
          <div class="btn_default">{{ t('text.withdraw') }}</div>
        </div>
      </div>
      <van-empty image="error" :description="t('text.disableWithdraw')" image-size="100" v-else />
      <div class="mt_20 flex justify_center" @click="handleGoRecord">
        <div class="gcolor fontSize_14 bold_600">{{ t('text.record') }} ></div>
      </div>
    </div>
    <i class="border_line border_scroll br_10"></i>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
import useStateStore from '@/stores/state';
const state = useStateStore();
import { copy } from '@/utils/copy';
import { showNotify } from 'vant';
let amount = ref(10);
let showWithdrawFee = ref(false);
let showWithdrawFree = ref(false);
let userinfo = ref(state.userInfo);
let withdrawConfig = ref(state.withdrawConfig);
let handleCopyAdress = () => {
  copy(state.address)
    .then((res) => {
      showNotify({ type: 'success', message: t('msg.copyed') });
    })
    .catch(() => {
      showNotify({ type: 'danger', message: t('msg.copyFail') });
    });
};
let handleClickMax = () => {
  amount.value = userinfo.canWithdraw;
};
let handleWithdraw = () => {
  if (!withdrawConfig.withdrawable) {
    showNotify({ type: 'danger', message: t('msg.disableWithdraw') });
    return;
  }
  if (!userinfo.canWithdraw) {
    showNotify({ type: 'danger', message: t('msg.noCanWithdraw') });
    return;
  }
  if (!amount.value || amount.value < state.withdrawConfig.withdrawMin) {
    showNotify({ type: 'danger', message: t('msg.minWithdraw') });
    return;
  }
  if (amount.value > userinfo.canWithdraw) {
    showNotify({ type: 'danger', message: t('msg.maxCanWithdraw') });
    return;
  }
  Withdraw({
    money: amount.value,
  })
    .then((res) => {
      showNotify({ type: 'success', message: t('msg.withdrawed') });
      state.fetchWithdrawConfig();
      state.fetchUserInfo();
    })
    .catch((err) => {
      showNotify({ type: 'danger', message: t('msg.withdrawFail') });
    });
};
let handleGoRecord = () => {
  router.push({
    path: '/records',
    query: {
      type: 'withdraw',
    },
  });
};
onMounted(() => {
  state.fetchWithdrawConfig();
  state.fetchUserInfo()
});
</script>

<style scoped>
.amount-item {
  width: calc(var(--base) * 74);
  height: calc(var(--base) * 74);
  background-color: #1b1b1b;
}
.amount-item div {
  height: 100%;
}
.amount_item_active {
  /* padding: calc(var(--base) * 4); */
  background-color: var(--green);
}
</style>
