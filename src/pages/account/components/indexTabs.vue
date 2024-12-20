<template>
  <!-- <div class="gcolor mb_20">{{ t('text.withdraw') }}</div> -->
  <div class="gcolor fontSize_32 text_center mb_15 mt_15 bold_700">{{ t('text.withdraw') }}</div>
  <withdraw></withdraw>
  <!-- <van-tabs v-model:active="active" background="transparent" title-active-color="var(--gradient-color1)">
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="ml_8" :class="active == 0 ? 'gcolor' : ''">{{ t('text.charge') }}</div>
        </div>
      </template>
      <charge></charge>
    </van-tab>
    <van-tab>
      <template #title>
        <div class="flex flex_center">
          <div class="ml_8" :class="active == 1 ? 'gcolor' : ''">{{ t('text.withdraw') }}</div>
        </div>
      </template>
      <withdraw></withdraw>
    </van-tab>
  </van-tabs> -->
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
