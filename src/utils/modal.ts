import pinia from '@/stores';
import { useUserStore } from '@/stores/modules';
// import { getCurrentInstance } from 'vue';
// const {
//   proxy: { $forceUpdate },
// }: any = getCurrentInstance();
// const userStore = useUserStore();

import { createAppKit } from '@reown/appkit';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { appName, appDescription } from '@/constants';
// 1. Get projectId at https://cloud.reown.com
const projectId = 'b5b9bf25c2eb3ffdf92152e71cfa4627';
const mainnetNetwork = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};
// 2. Create your application's metadata object
const metadata = {
  name: appName,
  description: appDescription,
  url: window.location.host, // url must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

// 3. Create a AppKit instance
export let appKit = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [mainnet, arbitrum],
  projectId,
  defaultNetwork: mainnetNetwork,
  features: {
    email: false, // default to true
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: [],
  },
});
async function getModalAccount() {
  let userStore = useUserStore();
  let address = appKit.getAddress();
  let chainId = appKit.getChainId();
  if (address && chainId) {
    localStorage.address = address;
    localStorage.chainId = chainId;
    userStore.setAddress(address);
    userStore.setChainId(chainId);
    userStore.login({
      chain: chainId * 1,
      address: address,
    });
    // $forceUpdate();
  }
  if (!userStore.address && !userStore.chainId) {
    setTimeout(() => {
      getModalAccount();
    }, 500);
  }
}
export function modalOopen() {
  let userStore = useUserStore();
  if (localStorage.address != appKit.getAddress()) {
    localStorage.removeItem('address');
    localStorage.removeItem('chainId');
    appKit.open();
    getModalAccount();
    return;
  }
  if (appKit.getAddress() && appKit.getChainId()) {
    let address = appKit.getAddress();
    let chainId = appKit.getChainId();
    if (address && chainId) {
      localStorage.address = address;
      localStorage.chainId = chainId;
      userStore.setAddress(address);
      userStore.setChainId(chainId);
      userStore.login({
        chain: chainId * 1,
        address: address,
      });
      return;
    }
  }
  appKit.open();
  getModalAccount();
}
