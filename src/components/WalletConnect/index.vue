<template>
  <div>
    <van-popup v-model:show="walletStore.showSelectNetwork" teleport='#app'>
      <div class="gborder">
        <div class="network_wrap pad_14">
          <div class="title-color fontSize_16 bold_700 gcolor text_center mb_20">
            {{ t('text.selectNetwork') }}
          </div>
          <div class="flex flex_center justify_sb">
            <div class="gborder br_50" @click="handleSelctNetwork('tron')">
              <div class="webp icon-chain-normal icon-chain-normal-tron"></div>
              <i class="border_line border_scroll br_50"></i>
            </div>
            <div class="gborder br_50" @click="handleSelctNetwork('bsc')">
              <div class="webp icon-chain-normal icon-chain-normal-bsc" ></div>
              <i class="border_line border_scroll br_50"></i>
            </div>
            <div class="gborder br_50" @click="handleSelctNetwork('eth')">
              <div class="webp icon-chain-normal icon-chain-normal-ethereum"></div>
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
import { userWalletStore, useUserStore } from '@/stores/modules';
const walletStore = userWalletStore();
const userStore = useUserStore();
import { connect as tronConnect } from '@/utils/tron';
import { modalOopen } from '@/utils/modal';
let handleSelctNetwork = (v) => {
  walletStore.setSelectNetwork(false);
  localStorage.network = v;
  if (v == 'tron') {
    tronConnect().then((res) => {
      if (res) {
        walletStore.setNetwork('tron');
        walletStore.setChainId(79);
        walletStore.setAddress(res.defaultAddress.base58);
        userStore.login({
          chain: 79 * 1,
          address: res.defaultAddress.base58,
        });
      }
    });
    return
  }
  if(v=='bsc'){
    modalOopen(v)
  }
};
onMounted(() => {});
</script>

<style scoped></style>
