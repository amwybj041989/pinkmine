<template>
  <div class="navbar_wrap">
    <van-nav-bar :title="t('text.record')" :left-text="t('text.back')" left-arrow @click-left="onClickLeft" />
  </div>
  <van-tabs v-model:active="active" background="transparent" title-active-color="var(--gradient-color1)">
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <!-- <div class="my-icon my-icon-shujuku" :class="active == 0 ? 'gcolor' : ''"></div> -->
          <div class="ml_8" :class="active == 0 ? 'gcolor' : ''">{{ t('text.profitRecord') }}</div>
        </div>
      </template>
      <div class="pad_14">
        <profitRecord></profitRecord>
      </div>
    </van-tab>
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <!-- <div class="my-icon my-icon-zhexiantu" :class="active == 1 ? 'gcolor' : ''"></div> -->
          <div class="ml_8" :class="active == 1 ? 'gcolor' : ''">{{ t('text.withdrawRecord') }}</div>
        </div>
      </template>
      <div class="pad_14">
        <withdrawRecord></withdrawRecord>
      </div>
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const active = ref(0);
const props = defineProps({
  // data: Object,
});
//const emit = defineEmits(['childToParent']);
const { t } = useI18n();

import profitRecord from './components/profitRecord.vue';
import withdrawRecord from './components/withdrawRecord.vue';
function onClickLeft() {
  router.go(-1);
}
onMounted(() => {
  if (route.query.type == 'profit') {
    active.value = 0;
  } else if (route.query.type == 'withdraw') {
    active.value = 1;
  } else {
    active.value = 0;
  }
});
</script>

<style scoped></style>
