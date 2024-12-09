<template>
  <van-tabs v-model:active="active" background="transparent" title-active-color="var(--gradient-color1)">
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-shujuku" :class="active == 0 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 0 ? 'gcolor' : ''">charge</div>
        </div>
      </template>
      <charge></charge>
    </van-tab>
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="my-icon my-icon-zhexiantu" :class="active == 1 ? 'gcolor' : ''"></div>
          <div class="ml_8" :class="active == 1 ? 'gcolor' : ''">withdraw</div>
        </div>
      </template>
      <withdraw></withdraw>
    </van-tab>
  </van-tabs>
</template>

<script setup lang="ts">
import charge from './charge.vue';
import withdraw from './withdraw.vue';
import { animateNumber, observeVisibility } from '@/utils';
const { t } = useI18n();
const active = ref(0);
const countDown = ref(null);
const finace = ref(null);

onMounted(() => {});
</script>

<style scoped></style>
