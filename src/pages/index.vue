<template>
  <HeaderBar></HeaderBar>
  <div class="vuemarquee_padding"></div>
  <div class="pad_12">
    <div class="mb_15" v-if="userStore.hasAuth != 2">
      <auth></auth>
    </div>
    <div class="mb_15">
      <indexTabs></indexTabs>
    </div>

    <div class="mb_15">
      <mining></mining>
    </div>
    <div class="mb_15">
      <Qa></Qa>
    </div>
    <!-- <div class="mb_15">
      <helpCenter></helpCenter>
    </div> -->
    <div class="mb_15">
      <auditReport></auditReport>
    </div>
    <div class="">
      <partner></partner>
    </div>
    <van-popup v-model:show="rewardShow" round teleport="#app" :close-on-click-overlay="false">
      <RewardList></RewardList>
    </van-popup>
    <van-popup v-model:show="boosterShow" round teleport="#app" :close-on-click-overlay="false">
      <Booster></Booster>
    </van-popup>
    <van-popup v-model:show="eventerShow" round teleport="#app" :close-on-click-overlay="false">
      <Eventer @join="handleJoinEvent"></Eventer>
    </van-popup>
    <van-cell title="展示弹出层" is-link @click="eventerShow = true" />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
import indexTabs from '@/components/Index/indexTabs.vue';
import mining from '@/components/Index/mining.vue';
import auth from '@/components/Index/auth.vue';
// import minintForm from '@/components/Index/minintForm.vue';
import helpCenter from '@/components/Index/helpCenter.vue';
import Qa from '@/components/Index/Qa.vue';
import auditReport from '@/components/Index/auditReport.vue';
import partner from '@/components/Index/partner.vue';
import useAppStore from '@/stores/modules/app';
import { languageColumns, locale } from '@/utils/i18n';
import { Auth, RewardList as apiRewardList, BoosterList, Event, JoinEvent } from '@/utils/api/index';
import { useUserStore } from '@/stores/modules';
import { showNotify } from 'vant';
const userStore = useUserStore();
const appStore = useAppStore();
const rewardShow = ref<boolean>(false);
const boosterShow = ref<boolean>(false);
const eventerShow = ref<boolean>(false);
const hashAuth = ref<boolean>(false);
const checked = ref<boolean>(false);
watch(
  () => userStore.loginStatus,
  (newMode) => {
    if (newMode) {
      fetchAuth();
      fetchEvent();
    }
  }
);
let handleJoinEvent = (r) => {
  JoinEvent({
    id: r.id,
  }).then((res) => {
    eventerShow.value=false
    if (res.success) {
      showNotify({
        type: 'success',
        message: t('msg.joinedEvnet'),
      });
    }
  }).catch(err=>{
    eventerShow.value=false
    showNotify({
      type: 'danger',
      message: err.mssage,
    });
  })
};
function fetchAuth() {
  Auth().then((res) => {
    console.log('Auth', res);
    // userStore.setAuth(res.data.status);
  });
}
let fetchEvent = () => {
  Event().then((res) => {
    console.log('Event', res);
    if (res.data) {
      eventerShow.value = true;
    } else {
      eventerShow.value = false;
      fetchBoosterList();
    }
  });
};
let fetchBoosterList = () => {
  BoosterList({
    pageIndex: 1,
    pageSize: 20,
  }).then((res) => {
    if (res.data.data && res.data.data.length) {
      boosterShow.value = true;
    } else {
      fetchRewardList();
    }
  });
};
let fetchRewardList = () => {
  apiRewardList({
    pageIndex: 1,
    pageSize: 20,
    status: 0,
  }).then((res) => {
    if (res.data.data && res.data.data.length) {
      rewardShow.value = true;
    } else {
      rewardShow.value = false;
    }
    console.log('apiRewardList', res);
  });
};
onMounted(() => {
  if (userStore.loginStatus) {
    fetchAuth();
    fetchEvent();
  }
  // fetchAuth()
});
</script>

<style scoped></style>
