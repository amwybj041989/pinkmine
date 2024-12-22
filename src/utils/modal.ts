import pinia from '@/stores';
import useStateStore from '@/stores/state';
import { createAppKit } from '@reown/appkit';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { bscTestnet, mainnet, bsc } from '@reown/appkit/networks';
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
// 3. Create a AppKit instance
export let appKit = createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [bsc, mainnet],
  // defaultNetwork: bsc,
  projectId,
  features: {
    email: false, // default to true
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: [],
  },
});
let initApp = (type) => {
  let networks = type == 'bsc' ? [bsc] : [mainnet];
  let defaultNetwork = type == 'bsc' ? bsc : mainnet;
  return createAppKit({
    adapters: [new Ethers5Adapter()],
    metadata: metadata,
    networks: networks,
    defaultNetwork: defaultNetwork,
    projectId,
    features: {
      email: false, // default to true
      analytics: true, // Optional - defaults to your Cloud configuration
      socials: [],
    },
  });
};
async function getModalAccount(v) {
  let state = useStateStore();
  let address = appKit.getAddress();
  let chainId = appKit.getChainId();
  // console.log(address != undefined && chainId);
  if (address != undefined && chainId) {
    // if (v == 'bsc') {
    //   state.setNetwork('bsc');
    //   appKit.switchNetwork(bsc);
    // } else {
    //   state.setNetwork('eth');
    //   appKit.switchNetwork(mainnet);
    // }
    let chain = v == 'bsc' ? 2 : 1;
    state.login({
      chain: chain * 1,
      address: address,
    });
    return;
  }
  setTimeout(() => {
    getModalAccount(v);
  }, 1000);
}
export function modalOopen(v) {
  let state = useStateStore();
  if (v == 'bsc') {
    state.setNetwork('bsc');
    // appKit.switchNetwork(bscTestnet);
    appKit.switchNetwork(bsc);
  } else {
    state.setNetwork('eth');
    appKit.switchNetwork(mainnet);
  }
  if (localStorage.address != initApp(v).getAddress()) {
    state.setAddress('');
    state.setChainId(null);
    initApp(v).open();
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
    return
  }
  initApp(v).open();
  getModalAccount(v);
}
