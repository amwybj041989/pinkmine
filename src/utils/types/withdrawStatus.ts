import { i18n } from '@/utils/i18n';
console.log(i18n);
let t = i18n.global.t;
export let withdrawStatus = [t('withdrawStatus.audit'), t('withdrawStatus.doing'), t('withdrawStatus.output'), t('withdrawStatus.fail')];
