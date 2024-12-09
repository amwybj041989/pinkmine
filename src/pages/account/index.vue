<template>
  <div class="navbar_wrap">
    <van-nav-bar title="标题" left-text="返回" left-arrow @click-left="onClickLeft" />
  </div>
  <div class="pad_14">
    <div class="mb_15">
      <myAccount></myAccount>
    </div>
    <div class="mb_15">
      <indexTabs></indexTabs>
    </div>
    <div class="mb_15">
      <auditReport></auditReport>
    </div>
    <div class="mb_15">
      <partner></partner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
import myAccount from './components/myAccount.vue';
import indexTabs from './components/indexTabs.vue';
import auditReport from '@/components/Index/auditReport.vue';
import partner from '@/components/Index/partner.vue';
function onClickLeft() {
  router.go(-1);
}
onMounted(() => {});
</script>

<style scoped></style>
