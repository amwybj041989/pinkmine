import pinia from '@/stores';
import { modalOopen, appKit } from '@/utils/modal';
import useStateStore from '@/stores/state';
import { showNotify } from 'vant';
const state = useStateStore();
export let walletConnect = () => {
  if (window.ethereum) {
    modalOopen('bsc');
    return;
  }
  if (window.web3) {
    modalOopen('bsc');
    return;
  }
  if (window.tronLink.ready) {
    tronWeb = tronLink.tronWeb;
    if (tronWeb.defaultAddress.base58) {
      state.setNetwork('tron');
      state.login({
        chain: 0,
        address: tronWeb.defaultAddress.base58,
      });
      return;
    }
    return;
  }
  tronLink
    .request({ method: 'tron_requestAccounts' })
    .then((tron) => {
      if (!tron) {
        showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
        return;
      }
      if (tron.code == 200) {
        tronWeb = tronLink.tronWeb;
        if (tronWeb.defaultAddress.base58) {
          state.setNetwork('tron');
          state.login({
            chain: 0,
            address: tronWeb.defaultAddress.base58,
          });
          return;
        }
      } else if (window.okxwallet && window.okxwallet) {
        tronWeb = window.okxwallet.tronWeb;
        if (window.okxwallet.tronWeb.defaultAddress.base58) {
          if (tronWeb.defaultAddress.base58) {
            state.setNetwork('tron');
            state.login({
              chain: 0,
              address: tronWeb.defaultAddress.base58,
            });
            return;
          }
        }
      } else {
        showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
        return;
      }
    })
    .catch((err) => {
      showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
    });
  // showNotify({ type: 'danger', message: i18n.global.t('msg.connectFail') });
  // appKit.open()
};
