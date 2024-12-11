import pinia from '@/stores';
import { defineStore } from 'pinia';
import type { LoginData, UserState } from '@/api/api';
import { Login, Auth } from '@/api/api';
const expiresIn = 0;
// const loginStatus = false;

export const useUserStore = defineStore(
  'user',
  () => {
    const address = ref<String>('');
    const hasAuth = ref<String>(1);
    if (localStorage.address) {
      address.value = localStorage.address;
    }

    const chainId = ref<Number>(0);
    if (localStorage.chainId) {
      chainId.value = localStorage.chainId * 1;
    }
    const loginStatus = ref<Boolean>(false);
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
    const setAuth=(value)=>{
      hasAuth.value=value
    }
    const login = async (loginForm: LoginData) => {
      try {
        const { data } = await Login(loginForm);
        localStorage.setItem('token', data.accessToken);
        setAddress(loginForm.address);
        setChainId(loginForm.chain);
        getLoginStatus();
        Auth().then((res) => {
          hasAuth.value = res.status;
        });
        console.log(data);
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
    // const info = async () => {
    //   try {
    //     const { data } = await getUserInfo();
    //     setInfo(data);
    //   } catch (error) {
    //     clearToken();
    //     throw error;
    //   }
    // };

    // const logout = async () => {
    //   try {
    //     await userLogout();
    //   } finally {
    //     clearToken();
    //     setInfo({ ...InitUserInfo });
    //   }
    // };

    // const getCode = async () => {
    //   try {
    //     const data = await getEmailCode();
    //     return data;
    //   } catch {}
    // };

    // const reset = async () => {
    //   try {
    //     const data = await resetPassword();
    //     return data;
    //   } catch {}
    // };

    // const register = async () => {
    //   try {
    //     const data = await userRegister();
    //     return data;
    //   } catch {}
    // };

    return {
      loginStatus,
      login,
      getLoginStatus,
      setAddress,
      address,
      chainId,
      setChainId,
      hasAuth,
      setAuth
    };
  },
  {
    persist: true,
  }
);

export default useUserStore;
