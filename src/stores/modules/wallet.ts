import { defineStore } from 'pinia';
const userWalletStore = defineStore(
  'wallet',
  () => {
    let networkType = ref<string>('');
    let showSelectNetwork = ref<boolean>(false);
    const chainId = ref<Number>(0);
    if (localStorage.chainId) {
      chainId.value = localStorage.chainId * 1;
    }
    const address = ref<String>('');
    if (localStorage.address) {
      address.value = localStorage.address;
    }
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
    let setNetwork = (v) => {
      networkType.value = v;
    };
    let setSelectNetwork = (v) => {
      setNetwork.value = '';
      showSelectNetwork.value = v;
    };
    return {
      networkType,
      setNetwork,
      chainId,
      address,
      setAddress,
      setChainId,
      showSelectNetwork,
      setSelectNetwork,
    };
  },
  {
    persist: true,
  }
);

export default userWalletStore;
