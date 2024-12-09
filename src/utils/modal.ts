import { useUserStore } from '@/stores';
const userStore = useUserStore();

import { createAppKit } from '@reown/appkit';
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5';
import { mainnet, arbitrum } from '@reown/appkit/networks';
import { appName, appDescription } from '@/constants';
// 1. Get projectId at https://cloud.reown.com
const projectId = 'b5b9bf25c2eb3ffdf92152e71cfa4627';

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
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

// export let getAppKitInfo = () => {
//   let address = appKit.getAddress();
//   let chainId = appKit.getChainId();
//   console.log('getAddress', address);
//   console.log('getChainId', chainId);
//   if (address && chainId) {
//     console.log(111111);
//     userStore.setAddress(address);
//     userStore.setChainId(chainId);
//   }
// };
