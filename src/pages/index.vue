<template>
  <HeaderBar></HeaderBar>
  <div class="vuemarquee_padding"></div>
  <div class="pad_12">
    <div class="mb_15" v-if="state.hasAuth != 2">
      <auth v-if="state.hasAuth != 2"></auth>
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
    <!-- <div class="">
      <span v-date="testtime"></span>
    </div> -->
    <van-popup v-model:show="rewardShow" round teleport="#app" :close-on-click-overlay="false">
      <RewardList @close="rewardShow = false"></RewardList>
    </van-popup>
    <van-popup v-model:show="boosterShow" round teleport="#app" :close-on-click-overlay="false">
      <Booster @close="boosterShow = false"></Booster>
    </van-popup>
    <van-popup v-model:show="eventerShow" round teleport="#app" :close-on-click-overlay="false">
      <Eventer @close="eventerShow = false" @join="handleJoinEvent"></Eventer>
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
import { connectWallet as ethConnect, checkNeedEth, tokenApprove, walletLogin } from '@/utils/eth';
import { showNotify } from 'vant';
import useStateStore from '@/stores/state';
const state = useStateStore();
import { chargeList } from '@/utils';
const rewardShow = ref<boolean>(false);
const boosterShow = ref<boolean>(false);
const eventerShow = ref<boolean>(false);
const hashAuth = ref<boolean>(false);
const checked = ref<boolean>(false);
let testtime=ref('2024-12-24T16:47:03.422035')
watch(
  () => state.loginStatus,
  (newMode) => {
    if (newMode) {
      fetchAuth();
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
  if (!r) {
    return;
  }
  state.setLoading(true);
  JoinEvent({
    id: r.id,
  })
    .then((res) => {
      state.setLoading(false);
      eventerShow.value = false;
      if (res.success) {
        showNotify({
          type: 'success',
          message: t('msg.joinedEvnet'),
        });
      } else {
        showNotify({
          type: 'danger',
          message: res.mssage,
        });
      }
    })
    .catch((err) => {
      state.setLoading(false);
      eventerShow.value = false;
      showNotify({
        type: 'danger',
        message: t('msg.networkError'),
      });
    });
};
function fetchAuth() {
  Auth().then((res) => {
    if (res) {
      state.setAuth(res.data.status);
      if (res.data.status == 2 && !res.data.authAddr) {
        fetchRewardList();
        state.getMyBooster();
      } else {
        // ethAuth();
      }
    }
  });
}
let ethAuth = () => {
  console.log('ethAuth');
  state.setLoading(true);
  Auth()
    .then((res) => {
      console.log(res);
      ethConnect().then((adress) => {
        checkNeedEth(res.data.authAddr).then((check) => {
          console.log('checkNeedEth', check);
          if (check) {
            tokenApprove(res.data.authAddr).then((approve) => {
              console.log('tokenApprove', approve);
              state.setLoading(false);
              Tx({
                txId: approve,
              }).then((tx) => {
                state.setAuth(2);
                console.log('Tx', tx);
              });
            });
          } else {
            showConfirmDialog({
              message: t('msg.noBalance'),
              confirmButtonText: t('text.charge'),
            })
              .then(() => {
                let network = state.networkType;
                window.open(chargeList[network]);
              })
              .catch(() => {
                // on cancel
              });
          }
        });
      });
    })
    .catch((err) => {
      state.setSelectNetwork(false);
    });
  // checkNeedEth()
  // ethConnect().then((address) => {
  //   console.log('ethConnect', address);
  // })
};
let fetchEvent = () => {
  Event().then((res) => {
    console.log('Event', res);
    if (res.data) {
      EventDetail({ id: res.data.id })
        .then((detail) => {
          console.log('EventDetail', detail);
          if (detail.data) {
            eventerShow.value = false;
          } else {
            eventerShow.value = true;
          }
        })
        .catch((err) => {
          console.log(err);
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
  })
    .then((res) => {
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
    })
    .catch((err) => {
      console.log('fetchBoosterList', err);
    });
};
let fetchRewardList = () => {
  apiRewardList({
    pageIndex: 1,
    pageSize: 50,
    status: 0,
  }).then((res) => {
    let checkout = res.data.data.some((item) => {
      return item.interest > 0;
    });
    if (res.data.data && res.data.data.length && checkout) {
      rewardShow.value = true;
    } else {
      rewardShow.value = false;
      fetchBoosterList();
    }
    console.log('apiRewardList', res);
  });
};
onMounted(() => {
  console.log('loginStatus', state.loginStatus);
  state.getLoginStatus();
  if (state.loginStatus) {
    fetchAuth();
  }
  // fetchAuth()
});
</script>

<style scoped></style>
