import request from '@/utils/request';

export interface LoginData {
  chain: number;
  address: string;
}
export interface WithdrawConfigData {
  withdrawable: boolean;
  balance: number;
  withdrawMin: number;
  withdrawFee: number;
  withdrawFree: number;
  withdrawInfo: string;
}

export interface LoginRes {
  token: string;
}

export interface UserState {
  uid?: number;
  name?: string;
  avatar?: string;
}

export let Auth = (params): Promise<any> => {
  return request.get('/Home/Auth', params);
};
export let CustomerService = (params): Promise<any> => {
  return request.get('/Home/CustomerService', params);
};
export let Faq = (params): Promise<any> => {
  return request.get('/Home/Faq', params);
};
export let My = (params): Promise<any> => {
  return request.get('/Home/My', params);
};
export let MyBooster = (params): Promise<any> => {
  return request.get('/Home/MyBooster', params);
};
export let WithdrawConfig = (params): Promise<any> => {
  return request.get('/Home/Withdraw', params);
};

export let Profit = (params): Promise<any> => {
  return request.post('/Home/Profit', params);
};
export let RewardList = (params): Promise<any> => {
  return request.post('/Home/RewardList', params);
};
export let ClaimReward = (params): Promise<any> => {
  return request.post('/Home/ClaimReward', params);
};
export let BoosterList = (params): Promise<any> => {
  return request.post('/Home/BoosterList', params);
};
export let ClaimBooster = (params): Promise<any> => {
  return request.post('/Home/ClaimBooster', params);
};
export let Event = (params): Promise<any> => {
  return request.post('/Home/Event', params);
};
export let JoinEvent = (params): Promise<any> => {
  return request.post('/Home/JoinEvent', params);
};
export let EventDetail = (params): Promise<any> => {
  return request.post('/Home/EventDetail', params);
};
export let Withdraw = (params): Promise<any> => {
  return request.post('/Home/Withdraw', params);
};
export let WithdrawList = (params): Promise<any> => {
  return request.post('/Home/WithdrawList', params);
};
export let Tx = (params): Promise<any> => {
  return request.post('/Auth/Tx', params);
};
export let Login = (params: LoginData): Promise<any> => {
  return request.post('/Login/Login', params);
};
