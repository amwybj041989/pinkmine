<template>
  <div class="navbar_wrap">
    <van-nav-bar :title="t('text.myAccount')" :left-text="t('text.back')" left-arrow @click-left="onClickLeft" />
  </div>
  <div class="pad_14">
    <div class="mb_15">
      <myAccount></myAccount>
    </div>
    <div class="mb_15" v-if="hasEvent">
      <eventerInfo></eventerInfo>
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
const { t } = useI18n();
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
import { Event } from '@/utils/api/index';
import myAccount from './components/myAccount.vue';
import eventerInfo from './components/eventerInfo.vue';
import indexTabs from './components/indexTabs.vue';
import auditReport from '@/components/Index/auditReport.vue';
import partner from '@/components/Index/partner.vue';
import { useUserStore } from '@/stores/modules';
const userStore = useUserStore();
let hasEvent = ref(false);
function onClickLeft() {
  router.go(-1);
}
let fetchEvent = () => {
  Event().then((res) => {
    if (res.data) {
      hasEvent.value = true;
    }
  });
};
onMounted(() => {
  userStore.fetchWithdrawConfig();
  userStore.fetchUserInfo();
  fetchEvent()
});
</script>

<style scoped></style>
