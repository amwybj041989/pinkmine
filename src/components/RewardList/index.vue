<template>
  <div class="rewardList_wrap gborder">
    <div class="rewardList pad_12" v-if="list.length">
      <div class="rewardList_item br_10 gborder" v-for="(item, i) in list" :key="i" :title="item">
        <rewardItem :data="item" @claim="onClaim(item, i)"></rewardItem>

        <i class="border_line border_scroll br_10"></i>
      </div>
    </div>
    <van-empty image="search" :description="t('msg.noReward')" v-else />
    <div class="pad_2_8 flex flex_center justify_center" v-show="totalPage > 1">
      <van-pagination v-model="currentPage" @change="fetchRewardList" :total-items="totalPage" mode="simple" :items-per-page="20" :force-ellipses="true">
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
        <template #page="{ text }">{{ text }}</template>
      </van-pagination>
      <!-- <div class="flex flex_center shrink_0 ml_20">
        <div class="">
          {{ t('reward.noClaim') }}
        </div>
        <van-switch v-model="checked" />
        <div class="">
          {{ t('reward.Claimed') }}
        </div>
      </div> -->
    </div>
    <i class="border_line border_scroll" style="border-radius: var(--van-popup-round-radius)"></i>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import rewardItem from './item.vue';
import { ClaimReward, RewardList } from '@/api/api';
import { showNotify } from 'vant';
const list = ref([]);
let currentPage = ref(1);
let totalPage = ref(0);
let checked = ref(false);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
let onClaim = (r, i) => {
  ClaimReward({
    idList: [r.id],
  }).then((res) => {
    list.value.splice(i, 1);
    showNotify({
      type: 'success',
      message: t('msg.Claimed'),
    });
  });
};
let fetchRewardList = () => {
  RewardList({
    pageIndex: currentPage.value,
    pageSize: 20,
    status: 0,
  }).then((res) => {
    list.value = res.data.data;
    totalPage.value = res.data.total;
  });
};
// const onLoad = () => {
//   fetchRewardList();
//   // setTimeout(() => {
//   //   if (refreshing.value) {
//   //     list.value = [];
//   //     refreshing.value = false;
//   //   }

//   //   for (let i = 0; i < 10; i++) {
//   //     list.value.push({
//   //       id: i + 1,
//   //       orderNo: '22222222222',
//   //       userID: '22222',
//   //       balance: '2222',
//   //       dailyRate: 0.33,
//   //       interest: '1231',
//   //       startTime: 123132,
//   //       endTime: '123213',
//   //       status: 11111,
//   //     });
//   //   }
//   //   loading.value = false;

//   //   if (list.value.length >= 40) {
//   //     finished.value = true;
//   //   }
//   // }, 1000);
// };

// const onRefresh = () => {
//   // 清空列表数据
//   finished.value = false;

//   // 重新加载数据
//   // 将 loading 设置为 true，表示处于加载状态
//   loading.value = true;
//   onLoad();
// };
onMounted(() => {
  fetchRewardList();
});
</script>

<style scoped>
.rewardList_wrap {
  width: 75vw;
  height: 75vh;
}
.rewardList {
  width: 100%;
  height: calc(75vh - var(--base) * 60);
  overflow-y: scroll;
}
.rewardList_item + .rewardList_item {
  margin-top: calc(var(--base) * 12);
}
</style>
