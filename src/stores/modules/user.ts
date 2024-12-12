import pinia from '@/stores';
import { defineStore } from 'pinia';
import type { LoginData, UserState, WithdrawConfigData } from '@/api/api';
import { Login, Auth, My, WithdrawConfig } from '@/api/api';
const expiresIn = 0;
// const loginStatus = false;

export const useUserStore = defineStore(
  'user',
  () => {
    const hasAuth = ref<String>(1);
    let withdrawConfig = ref<WithdrawConfigData>({});
    const address = ref<String>('');
    if (localStorage.address) {
      address.value = localStorage.address;
    }

    const chainId = ref<Number>(0);
    if (localStorage.chainId) {
      chainId.value = localStorage.chainId * 1;
    }
    const loginStatus = ref<Boolean>(false);
    const userInfo = ref<Object>({});

    const getLoginStatus = () => {
      if (localStorage.getItem('token') && address.value && chainId.value) {
        loginStatus.value = true;
      } else {
        loginStatus.value = false;
      }
      return loginStatus;
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
      if (!value) {
        localStorage.removeItem('chainId');
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
      try {
        const { data } = await My();
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    let fetchWithdrawConfig = async () => {
      try {
        const { data } = await WithdrawConfig();
        console.log('fetchWithdrawConfig', data);
        setWithdrawConfig(data);
      } catch (error) {
        console.log(error);
      }
    };
    const login = async (loginForm: LoginData) => {
      try {
        const { data } = await Login(loginForm);
        if (data) {
          localStorage.setItem('token', data.accessToken);
          setAddress(loginForm.address);
          setChainId(loginForm.chain);
          getLoginStatus();
          fetchUserInfo();
          fetchWithdrawConfig();
          Auth().then((res) => {
            hasAuth.value = res.status;
          });
        }
      } catch (error) {
        setAddress('');
        setChainId(0);
        localStorage.removeItem('token');
        console.log(error);
      }
    };
    // if (localStorage.chainId && localStorage.address) {
    //   login({
    //     chain: localStorage.chainId * 1,
    //     address: localStorage.address,
    //   });
    // }
    getLoginStatus();

    return {
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
    };
  },
  {
    persist: true,
  }
);

export default useUserStore;
