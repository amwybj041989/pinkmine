<template>
  <HeaderBar></HeaderBar>
  <div class="vuemarquee_padding"></div>
  <div class="pad_12">
    <div class="mb_15" v-if="state.hasAuth != 2">
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
      <RewardList @close="rewardShow = false"></RewardList>
    </van-popup>
    <van-popup v-model:show="boosterShow" round teleport="#app" :close-on-click-overlay="false">
      <Booster @close="boosterShow = false"></Booster>
    </van-popup>
    <van-popup v-model:show="eventerShow" round teleport="#app" :close-on-click-overlay="false">
      <Eventer @join="handleJoinEvent"></Eventer>
    </van-popup>
    <!-- <van-cell title="展示弹出层" is-link @click="handleTest" /> -->
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
import { languageColumns, locale } from '@/utils/i18n';
import { Auth, RewardList as apiRewardList, BoosterList, Event, JoinEvent, EventDetail } from '@/utils/api/index';
import { showNotify } from 'vant';
import useStateStore from '@/stores/state';
const state = useStateStore();
const rewardShow = ref<boolean>(false);
const boosterShow = ref<boolean>(false);
const eventerShow = ref<boolean>(false);
const hashAuth = ref<boolean>(false);
const checked = ref<boolean>(false);
watch(
  () => state.loginStatus,
  (newMode) => {
    if (newMode) {
      fetchAuth();
      fetchRewardList();
    }
  }
);
let handleTest = () => {
  boosterShow.value = true;
  // state.setAuth(2);
  // console.log(state.hasAuth);
  // console.log(state.loginStatus);
};
let handleJoinEvent = (r) => {
  JoinEvent({
    id: r.id,
  })
    .then((res) => {
      eventerShow.value = false;
      if (res.success) {
        showNotify({
          type: 'success',
          message: t('msg.joinedEvnet'),
        });
      }
    })
    .catch((err) => {
      eventerShow.value = false;
      showNotify({
        type: 'danger',
        message: err.mssage,
      });
    });
};
function fetchAuth() {
  Auth().then((res) => {
    if (res) {
      state.setAuth(res.data.status);
    }
  });
}
let fetchEvent = () => {
  Event().then((res) => {
    console.log('Event', res);

    if (res.data) {
      EventDetail({ id: res.data.id }).then((detail) => {
        if (detail.data) {
          eventerShow.value = false;
        } else {
          eventerShow.value = true;
        }
      });
    } else {
      eventerShow.value = false;
      // fetchBoosterList();
    }
  });
};
let fetchBoosterList = () => {
  BoosterList({
    pageIndex: 1,
    pageSize: 20,
  }).then((res) => {
    console.log('BoosterList', res);
    if (res.data && res.data.length) {
      let checkout = res.data.some((item) => {
        return item.canClaim == true;
      });
      console.log('fetchBoosterList', checkout);
      if (checkout) {
        boosterShow.value = true;
      } else {
        boosterShow.value = false;
        fetchEvent();
      }
    } else {
      boosterShow.value = false;
      fetchEvent();
      // fetchRewardList();
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
      fetchBoosterList();
    }
    console.log('apiRewardList', res);
  });
};
onMounted(() => {
  if (state.loginStatus) {
    fetchAuth();
    fetchRewardList();
  }
  // fetchAuth()
});
</script>

<style scoped></style>
