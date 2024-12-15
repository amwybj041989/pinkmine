import { ethers } from 'ethers';
import { showNotify } from 'vant';
import { ABI, contractAddress } from './abi';
import { i18n } from '@/utils/i18n';
// import TronWeb from 'tronweb';
export async function connect() {
  return new Promise((res, rej) => {
    // 检查浏览器是否有tronWeb
    // if (typeof window !== 'undefined' && (window as any).tronWeb) {
    //   console.log(TronWeb);
    //   console.log(111);
    //   // if (window.tronLink.ready) {
    //   //   console.log(2222);
    //   // }else if(TronWeb.ready){
    //   //   console.log(333);
    //   // }
    // } else {
    //   // 如果浏览器没有tronWeb，则提示用户安装TronLink
    //   window.open('https://www.tronlink.org/');
    // }
    let tronWeb;

    if (window.tronLink.ready) {
      tronWeb = tronLink.tronWeb;
      return res(tronWeb);
    } else {
      tronLink
        .request({ method: 'tron_requestAccounts' })
        .then((tron) => {
          if (!tron) {
            showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
            return rej(false);
          }
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
            return rej(false);
          }
        })
        .catch((err) => {
          return rej(err);
        });
    }
  });
}

export async function tokenBalance() {
  const contractAddress = contractAddress; //合约地址
  const contract = await tronWeb.contract(ABI, contractAddress);
  const decimals = await contract.decimals().call();
  const balance = await contract.balanceOf(window.tronWeb.defaultAddress.base58).call();
  return new Promise((res) => {
    return res(ethers.formatUnits(balance.toBigInt(), decimals));
  });
  // console.log('余额', ethers.formatUnits(balance.toBigInt(), decimals));
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
  });
}
