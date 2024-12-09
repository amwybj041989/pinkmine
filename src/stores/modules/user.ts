import { defineStore } from 'pinia';
import type { LoginData, UserState } from '@/api/api';

import { Login } from '@/api/api';
const expiresIn = 0;
// const loginStatus = false;

export const useUserStore = defineStore(
  'user',
  () => {
    const address = ref<String>('');
    const loginStatus = ref<Boolean>(false);
    const getLoginStatus = () => {
      if (localStorage.getItem('token') && address.value) {
        loginStatus.value = true;
      } else {
        loginStatus.value = false;
      }
      return loginStatus;
    };
    // Set user's information
    const setAddress = (value) => {
      address.value = value;
    };

    const login = async (loginForm: LoginData) => {
      try {
        const { data } = await Login(loginForm);
        localStorage.setItem('token', data.accessToken);
      } catch (error) {
        localStorage.clear();
        throw error;
      }
    };

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
      login,
      getLoginStatus,
      setAddress,
      address
    };
  },
  {
    persist: true,
  }
);

export default useUserStore;
