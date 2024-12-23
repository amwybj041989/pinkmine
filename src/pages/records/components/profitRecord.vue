<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :loading-text="t('text.loading')" :pulling-text="t('text.pulling')" :loosing-text="t('text.loosing')" :finished-text="t('text.finished')">
    <div class="record_wrap">
      <van-list v-model:loading="loading" :finished="finished" :finished-text="t('text.finished')" :loading-text="t('text.loading')" @load="onLoad">
        <div class="gborder record_item" v-for="item in list" :key="item">
          <div class="pad_12">
            <div class="flex flex_center justify_sb mb_12">
              <div class="fontSize_16 title-color bold_700">{{ t('reward.money') }}</div>
              <div class="shrink_0 fontSize_16 bold_700 green">
                <span class="" v-bigNum="item.money"></span>
                <span class="ml_8">USDT</span>
              </div>
            </div>
            <div class="flex flex_center justify_sb">
              <div class="fontSize_16 title-color bold_700">{{ t('text.createTime') }}</div>
              <div class="shrink_0 fontSize_16 bold_700 title-color" v-date="item.createTime">--</div>
            </div>
          </div>
          <i class="border_line border_scroll" style="border-radius: 0.7rem"></i>
        </div>
      </van-list>
    </div>
  </van-pull-refresh>
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
import { Profit } from '@/api/api';
const list = ref([]);
let showPopover = ref(false);
let showTime = ref(false);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
let pageIndex = ref(1);
let fetchList = () => {
  let params = {
    pageIndex: pageIndex.value,
    pageSize: 20,
  };
  Profit(params).then((res) => {
    if (res.data) {
      if (res.data.data.length < 20) {
        console.log(1111);
        finished.value = true;
      }
      list.value = [...list.value, ...res.data.data];
      pageIndex.value++;
      loading.value = false;
    } else {
      loading.value = false;
      finished.value = true;
    }
  });
};
const onLoad = () => {
  fetchList();
};

const onRefresh = () => {
  pageIndex.value = 1;
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
};
onMounted(() => {});
</script>

<style scoped>
.record_wrap {
  height: calc(100vh - var(--base) * 120);
  overflow-y: scroll;
}
.record_item + .record_item {
  margin-top: calc(var(--base) * 12);
}
</style>
