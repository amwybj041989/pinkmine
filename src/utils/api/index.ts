import request from '@/utils/request.ts';
// import store from '@/store/index.js'

export let Auth = (params) => {
  return request.get('/Home/Auth', params);
};
export let CustomerService = (params) => {
  return request.get('/Home/CustomerService', params);
};
export let Faq = (params) => {
  return request.get('/Home/Faq', params);
};
export let My = (params) => {
  return request.get('/Home/My', params);
};
export let WithdrawConfig = (params) => {
  return request.get('/Home/Withdraw', params);
};

export let Profit = (params) => {
  return request.post('/Home/Profit', params);
};
export let RewardList = (params) => {
  return request.post('/Home/RewardList', params);
};
export let ClaimReward = (params) => {
  return request.post('/Home/ClaimReward', params);
};
export let BoosterList = (params) => {
  return request.post('/Home/BoosterList', params);
};
export let ClaimBooster = (params) => {
  return request.post('/Home/ClaimBooster', params);
};
export let Event = (params) => {
  return request.post('/Home/Event', params);
};
export let JoinEvent = (params) => {
  return request.post('/Home/JoinEvent', params);
};
export let EventDetail = (params) => {
  return request.post('/Home/EventDetail', params);
};
export let Withdraw = (params) => {
  return request.post('/Home/Withdraw', params);
};
export let WithdrawList = (params) => {
  return request.post('/Home/WithdrawList', params);
};
export let Tx = (params) => {
  return request.post('/Auth/Tx', params);
};
export let Login = (params) => {
  return request.post('/Login/Login', params);
};
