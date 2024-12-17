<template>
  <div class="rewardList_wrap gborder" v-loading="list.length">
    <div class="rewardList pad_12">
      <div class="rewardList_item br_10 gborder" v-for="(item, i) in list" :key="i">
        <BoosterItem :data="item" @claim="onClaim(item, i)"></BoosterItem>

        <i class="border_line border_scroll br_10"></i>
      </div>
    </div>
    <i class="border_line border_scroll" style="border-radius: var(--van-popup-round-radius)"></i>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
import BoosterItem from './BoosterItem.vue';
import { ClaimBooster, BoosterList } from '@/api/api';
import useStateStore from '@/stores/state';
const state = useStateStore();
import { showNotify } from 'vant';

const list = ref([]);
let currentPage = ref(1);
let totalPage = ref(0);
let checked = ref(false);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
let onClaim = (r, i) => {
  state.setLoading(true);
  ClaimBooster({
    id: r.id,
  }).then((res) => {
    state.setLoading(false);
    list.value.splice(i, 1);
    showNotify({
      type: 'success',
      message: t('msg.Claimed'),
    });
    // if (!list.value.length) {
    emit('close');
    state.getMyBooster();
    // }
  });
};
let fetchRewardList = () => {
  BoosterList({
    pageIndex: currentPage.value,
    pageSize: 20,
    status: checked.value ? 1 : 0,
  }).then((res) => {
    console.log('fetchRewardList', res);
    list.value = res.data;
  });
};
onMounted(() => {
  fetchRewardList();
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
  height: 100%;
  overflow-y: scroll;
}
.rewardList_item + .rewardList_item {
  margin-top: calc(var(--base) * 12);
}
</style>
