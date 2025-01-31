import pinia from '@/stores';
import { defineStore } from 'pinia';
import { Login, Auth, My, WithdrawConfig, MyBooster, CustomerService } from '@/api/api';
import { appKit } from '@/utils/modal';
let types = {
  tron: 'TRX',
  bsc: 'BNB',
  eth: 'ETH',
};
export let useStateStore = defineStore(
  'state',
  () => {
    let isDev = ref(false);
    if (process.env.NODE_ENV === 'development') {
      isDev.value = true;
    } else {
      isDev.value = false;
    }
    let loading = ref(false);
    let hasAuth = ref(1);
    let withdrawConfig = ref<WithdrawConfigData>({});
    let walletToken = ref('');
    let address = ref<String>('');
    let myBooster = ref<any>(null);
    if (localStorage.address) {
      address.value = localStorage.address;
    }

    let chainId = ref<Number>(null);
    if (localStorage.chainId) {
      chainId.value = localStorage.chainId * 1;
    }
    let loginStatus = ref<Boolean>(false);
    let userInfo = ref<Object>({});
    let networkType = ref('');
    if (localStorage.network) {
      networkType.value = localStorage.network;
    }
    let servieLink = ref('');
    let getNetworkType = (v) => {
      if (v) {
        networkType.value = v;
        localStorage.network = v;
        setWalletToken(v);
      }
      if (localStorage.getItem('network')) {
        networkType.value = localStorage.network;
        setWalletToken(localStorage.network);
      }
    };
    let setWalletToken = (v) => {
      walletToken.value = types[v];
    };
    let getMyBooster = (v) => {
      MyBooster().then((res) => {
        if (res.data) {
          myBooster.value = res.data;
          let now = new Date().getTime();
          myBooster.value.expireTimestamp = res.data.expireTimestamp * 1000 - now;
          myBooster.value.hasBooster = true;
        } else {
          myBooster.value = null;
        }
      });
    };
    let showSelectNetwork = ref<boolean>(false);
    let setLoading = (value) => {
      loading.value = value;
    };
    let setSelectNetwork = (v) => {
      showSelectNetwork.value = v;
    };

    let getLoginStatus = () => {
      loginStatus.value = false;
      if (!localStorage.getItem('token')) {
        loginStatus.value = false;
        return;
      }
      if (localStorage.getItem('token') != null && localStorage.getItem('token') != '' && localStorage.getItem('token') != undefined && address.value && networkType.value != '') {
        loginStatus.value = true;
      } else {
        loginStatus.value = false;
      }
    };
    let setAddress = (value) => {
      localStorage.address = value;
      address.value = value;
      if (!value) {
        localStorage.removeItem('address');
      }
    };
    let setChainId = (value) => {
      localStorage.chainId = value;
      chainId.value = value;
      if (value == null) {
        localStorage.removeItem('chainId');
        chainId.value = null;
      }
    };

    let setWithdrawConfig = (value) => {
      withdrawConfig.value = value;
    };

    let setAuth = (value) => {
      hasAuth.value = value;
    };

    let setUserInfo = (value) => {
      userInfo.value = value;
    };
    let fetchAuth = () => {
      Auth().then((res) => {
        setAuth(res.data.status);
      });
    };
    let fetchServieLink = () => {
      CustomerService().then((res) => {
        servieLink.value = res.data;
      });
    };
    let fetchUserInfo = async () => {
      function getDifferenceFromNow(startTime) {
        // 将时间字符串转换为Date对象
        let start = new Date(startTime);

        // 计算开始时间后6小时的时间
        let sixHoursLater = new Date(start.getTime() + 6 * 60 * 60 * 1000); // 6小时转换为毫秒

        // 获取当前时间的毫秒时间戳
        let now = new Date();

        // 计算差值
        let difference = sixHoursLater - now;

        return difference;
      }
      try {
        let { data } = await My();
        if (data) {
          data.coutDownTime = getDifferenceFromNow(data.lastProfitTime);
        } else {
          data.coutDownTime = 0;
        }
        // console.log(data);
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    let fetchWithdrawConfig = async () => {
      try {
        let { data } = await WithdrawConfig();
        // console.log('fetchWithdrawConfig', data);
        setWithdrawConfig(data);
      } catch (error) {
        console.log(error);
      }
    };

    let login = async (loginForm) => {
      // init()
      try {
        let { data, success } = await Login(loginForm);
        if (loginForm.chain == 0) {
          getNetworkType('tron');
        }
        if (loginForm.chain == 1) {
          getNetworkType('eth');
        }
        if (loginForm.chain == 2) {
          getNetworkType('bsc');
        }
        if (!success) {
          setLoading(false);
          return;
        }
        setLoading(false);
        localStorage.setItem('token', data.accessToken);
        setAddress(loginForm.address);
        getLoginStatus();
        fetchUserInfo();
        fetchWithdrawConfig();
        fetchAuth();
        fetchServieLink();
      } catch (error) {
        setLoading(false);
        setAddress('');
        setChainId(null);
        localStorage.removeItem('token');
        console.log(error);
      }
    };

    let setNetwork = (v) => {
      if (v == null || v == '') {
        networkType.value = '';
        localStorage.removeItem('network');
        return;
      }
      networkType.value = v;
      if (v == 'tron') {
        setChainId(6);
      }
      if (v == 'bsc') {
        setChainId(56);
      }
      if (v == 'eth') {
        setChainId(1);
      }
    };
    let init = () => {
      loading.value = false;
      hasAuth.value = 1;
      withdrawConfig.value = {};
      walletToken.value = '';
      address.value = '';
      myBooster.value = null;

      chainId.value = null;
      loginStatus.value = false;
      userInfo.value = {};
      networkType.value = '';
    };
    getLoginStatus();
    return {
      isDev,
      loading,
      setLoading,
      loginStatus,
      login,
      getLoginStatus,
      setAddress,
      address,
      chainId,
      setChainId,
      hasAuth,
      setAuth,
      userInfo,
      fetchUserInfo,
      withdrawConfig,
      fetchWithdrawConfig,
      networkType,
      setNetwork,
      showSelectNetwork,
      setSelectNetwork,
      getNetworkType,
      walletToken,
      myBooster,
      getMyBooster,
      fetchAuth,
      init,
      servieLink,
      fetchServieLink,
    };
  },
  {
    persist: true,
  }
);
export default useStateStore;
