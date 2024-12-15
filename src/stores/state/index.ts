import pinia from '@/stores';
import { defineStore } from 'pinia';
import { Login, Auth, My, WithdrawConfig } from '@/api/api';
export const useStateStore = defineStore(
  'state',
  () => {
    const loading = ref(false);
    const hasAuth = ref<String>(1);
    let withdrawConfig = ref<WithdrawConfigData>({});
    const address = ref<String>('');
    if (localStorage.address) {
      address.value = localStorage.address;
    }

    const chainId = ref<Number>(null);
    if (localStorage.chainId) {
      chainId.value = localStorage.chainId * 1;
    }
    const loginStatus = ref<Boolean>(false);
    const userInfo = ref<Object>({});
    let networkType = ref('');
    if (localStorage.network) {
      networkType.value = localStorage.network;
    }
    let getNetworkType = () => {
      if (localStorage.getItem('network')) {
        networkType.value = localStorage.network;
      }
    };
    let showSelectNetwork = ref<boolean>(false);
    const setLoading = (value) => {
      loading.value = value;
    };
    let setSelectNetwork = (v) => {
      showSelectNetwork.value = v;
    };

    const getLoginStatus = () => {
      // console.log('token', localStorage.getItem('token'));
      // console.log('address', address.value);
      // console.log('chainId', chainId.value);
      if (localStorage.getItem('token') != null && localStorage.getItem('token') != '' && localStorage.getItem('token') != undefined && address.value && chainId.value != null) {
        loginStatus.value = true;
      } else {
        loginStatus.value = false;
      }
      // return loginStatus;
    };
    const setAddress = (value) => {
      localStorage.address = value;
      address.value = value;
      if (!value) {
        localStorage.removeItem('address');
      }
    };
    const setChainId = (value) => {
      localStorage.chainId = value;
      chainId.value = value;
      if (value == null) {
        localStorage.removeItem('chainId');
        chainId.value = null;
      }
    };

    const setWithdrawConfig = (value) => {
      withdrawConfig.value = value;
    };

    const setAuth = (value) => {
      hasAuth.value = value;
    };

    const setUserInfo = (value) => {
      userInfo.value = value;
    };

    const fetchUserInfo = async () => {
      function getDifferenceFromNow(startTime) {
        // 将时间字符串转换为Date对象
        const start = new Date(startTime);

        // 计算开始时间后6小时的时间
        const sixHoursLater = new Date(start.getTime() + 6 * 60 * 60 * 1000); // 6小时转换为毫秒

        // 获取当前时间的毫秒时间戳
        const now = new Date();

        // 计算差值
        const difference = sixHoursLater - now;

        return difference;
      }
      try {
        const { data } = await My();
        if (data) {
          data.coutDownTime = getDifferenceFromNow(data.lastProfitTime);
        } else {
          data.coutDownTime = 0;
        }
        console.log(data);
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    let fetchWithdrawConfig = async () => {
      try {
        const { data } = await WithdrawConfig();
        setWithdrawConfig(data);
      } catch (error) {
        console.log(error);
      }
    };

    const login = async (loginForm) => {
      console.log('loginForm', loginForm);
      try {
        // let parmas = {
        //   chain: loginForm.chain,
        //   address: loginForm.address,
        // };
        const { data, success } = await Login(loginForm);
        if (!success) {
          setLoading(false);
          return;
        }
        setLoading(false);
        localStorage.setItem('token', data.accessToken);
        setAddress(loginForm.address);
        setChainId(loginForm.chain);
        getLoginStatus();
        fetchUserInfo();
        fetchWithdrawConfig();
        Auth().then((res) => {
          hasAuth.value = res.status;
        });
      } catch (error) {
        setLoading(false);
        setAddress('');
        setChainId(null);
        localStorage.removeItem('token');
        console.log(error);
      }
    };

    let setNetwork = (v) => {
      networkType.value = v;
      if (v == 'tron') {
        setChainId(0);
      }
      if (v == 'bsc') {
        setChainId(1);
      }
      if (v == 'eth') {
        setChainId(2);
      }
    };

    getLoginStatus();

    return {
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
    };
  },
  {
    persist: true,
  }
);
export default useStateStore;
