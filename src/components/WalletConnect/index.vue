<template>
  <div v-if="state.showSelectNetwork">
    <van-popup v-model:show="state.showSelectNetwork" teleport="#app">
      <div class="gborder">
        <div class="network_wrap pad_14">
          <div class="title-color fontSize_16 bold_700 gcolor text_center mb_20">
            {{ t('text.selectNetwork') }}
          </div>
          <div class="flex flex_center justify_sb">
            <div class="gborder br_50" @click="handleSelctNetwork('bsc')">
              <div class="webp icon-chain-normal icon-chain-normal-bsc"></div>
              <i class="border_line border_scroll br_50"></i>
            </div>
            <div class="gborder br_50" @click="handleSelctNetwork('eth')">
              <div class="webp icon-chain-normal icon-chain-normal-ethereum"></div>
              <i class="border_line border_scroll br_50"></i>
            </div>
            <div class="gborder br_50" @click="handleSelctNetwork('tron')">
              <div class="webp icon-chain-normal icon-chain-normal-tron"></div>
              <i class="border_line border_scroll br_50"></i>
            </div>
          </div>
        </div>
        <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

const props = defineProps({
  // data: Object,
});
//const emit = defineEmits(['childToParent']);
const { t } = useI18n();
import useStateStore from '@/stores/state';
import { connect as tronConnect } from '@/utils/tron';
import { connectWallet as ethConnect, checkNeedEth, tokenApprove } from '@/utils/eth';
import { modalOopen } from '@/utils/modal';
const state = useStateStore();
let handleSelctNetwork = (v) => {
  state.setSelectNetwork(false);
  localStorage.network = v;
  if (v == 'tron') {
    state.setLoading(true);
    tronConnect()
      .then((res) => {
        if (res) {
          state.setNetwork('tron');
          state.login({
            chain: 0,
            address: res.defaultAddress.base58,
          });
        }
      })
      .catch(() => {
        state.setLoading(false);
      });
    return;
  }
  modalOopen(v);
};
onMounted(() => {});
</script>

<style scoped></style>
