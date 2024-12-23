import pinia from '@/stores';
import useStateStore from '@/stores/state';
import { createAppKit } from '@reown/appkit';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { bscTestnet, mainnet, bsc, tron } from '@reown/appkit/networks';
// import * as networks from '@reown/appkit/networks';
import { appName, appDescription } from '@/constants';
// console.log(networks);
const projectId = 'b5b9bf25c2eb3ffdf92152e71cfa4627';
const metadata = {
  name: appName,
  description: appDescription,
  url: window.location.host, // url must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};
export let appKit = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [bsc, mainnet, tron],
  defaultNetwork: bsc,
  projectId,
  features: {
    email: false, // default to true
    // analytics: true, // Optional - defaults to your Cloud configuration
    socials: [],
  },
});
let getChain = (id) => {
  let state = useStateStore();
  let chain;
  if (id == 56) {
    state.setNetwork('bsc');
    chain = 2;
  }
  if (id == 1) {
    state.setNetwork('eth');
    chain = 1;
  }
  if (id == 6) {
    state.setNetwork('tron');
    chain = 0;
  }
  return chain;
};
let regetModalAccount = () => {
  window.clearInterval(window['getAccount']);
  setTimeout(() => {
    getModalAccount();
  }, 30 * 1000);
};
async function getModalAccount(v) {
  // if (window['getAccount']) {
  //   window.clearInterval(window['getAccount']);
  // }
  window['getAccount'] = setInterval(() => {
    let state = useStateStore();

    let isConnected = appKit.getIsConnectedState();
    console.log('isConnected', isConnected);
    if (!isConnected && state.loginStatus && localStorage.getItem('chainId')) {
      localStorage.clear();
      appKit.disconnect();
      window.location.reload();
    }
    // if (!isConnected && !state.loginStatus) {
    //   state.setLoading(true);
    // }
    if (isConnected) {
      if (!state.loginStatus) {
        state.setLoading(true);
      }
      let address = appKit.getAddress();
      let chainId = appKit.getChainId();
      if (!state.loginStatus && !state.chainId && chainId != 56) {
        appKit.switchNetwork(bsc);
        regetModalAccount();
      }
      if (!state.loginStatus && state.chainId && address != undefined && chainId) {
        state.login({
          chain: getChain(chainId) * 1,
          address: address,
        });
        regetModalAccount();
      }
      if (state.loginStatus && state.chainId * 1 != chainId) {
        state.setLoading(true);
        state.login({
          chain: getChain(chainId) * 1,
          address: address,
        });
        // regetModalAccount();
      }
    }
  }, 1000);
}
getModalAccount();
export function appKitOpen() {
  let state = useStateStore();
  appKit.open();
  window.clearInterval(window['getAccount']);
  getModalAccount();
}

export function modalOopen(v) {
  let state = useStateStore();
  if (state.loginStatus) {
    appKit.open();
    return;
  }
  if (v == 'bsc') {
    state.setNetwork('bsc');
    // appKit.switchNetwork(bscTestnet);
    appKit.switchNetwork(bsc);
  } else {
    state.setNetwork('eth');
    appKit.switchNetwork(mainnet);
  }
  if (localStorage.address != appKit.getAddress()) {
    state.setAddress('');
    state.setChainId(null);
    if (v == 'bsc') {
      bscAppKit.open();
    } else {
      ethAppKit.open();
    }
    getModalAccount(v);
    return;
  }
  if (appKit.getAddress() && appKit.getChainId()) {
    let address = appKit.getAddress();
    let chainId = appKit.getChainId();
    if (address && chainId) {
      let chain = v == 'bsc' ? 2 : 1;
      state.login({
        chain: chain * 1,
        address: address,
      });
      return;
    }
    return;
  }
  appKit.open();
  // if (v == 'bsc') {
  //   bscAppKit.open();
  // } else {
  //   ethAppKit.open();
  // }
  getModalAccount();
}
