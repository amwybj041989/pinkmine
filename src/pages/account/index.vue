<template>
  <div class="navbar_wrap">
    <van-nav-bar :title="t('text.myAccount')" :left-text="t('text.back')" left-arrow @click-left="onClickLeft" />
  </div>
  <div class="pad_14">
    <div class="mb_15" v-if="state.hasAuth == 2">
      <myAccount></myAccount>
    </div>
    <div class="mb_15" v-if="state.hasAuth != 2">
      <auth></auth>
    </div>
    <div class="mb_15">
      <indexTabs></indexTabs>
    </div>
    <div class="mb_15" v-if="hasEvent">
      <eventerInfo></eventerInfo>
    </div>
    <div class="mb_15" v-if="hasBooster">
      <Booster></Booster>
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
import { Event, EventDetail, MyBooster, Auth } from '@/api/api';
import auth from '@/components/Index/auth.vue';
import myAccount from './components/myAccount.vue';
import Booster from './components/myBoosterComponents.vue';
import eventerInfo from './components/eventerInfo.vue';
import indexTabs from './components/indexTabs.vue';
import auditReport from '@/components/Index/auditReport.vue';
import partner from '@/components/Index/partner.vue';
import useStateStore from '@/stores/state';

const state = useStateStore();
const hashAuth = ref<boolean>(false);
let hasEvent = ref(false);
let hasBooster = ref(state.myBooster);
function onClickLeft() {
  router.go(-1);
}
let fetchEvent = () => {
  Event().then((res) => {
    console.log('fetchEvent', res);
    if (res.data) {
      EventDetail({ id: res.data.id }).then((detail) => {
        console.log('detail', detail);
        if (detail.data) {
          hasEvent.value = true;
        }
      });
    }
  });
};
let fetchMyBooster = () => {
  MyBooster().then((res) => {
    if (res.data) {
      hasBooster.value = true;
    }
    console.log('MyBooster', res);
  });
};
function fetchAuth() {
  Auth().then((res) => {
    if (res) {
      state.setAuth(res.data.status);
    }
  });
}
onMounted(() => {
  fetchEvent();
  // fetchMyBooster();
  state.fetchWithdrawConfig();
  state.fetchUserInfo();
  state.getMyBooster();
  state.fetchAuth();
});
</script>

<style scoped></style>
