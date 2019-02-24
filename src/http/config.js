export default {
  // 基础url前缀
  baseURL: process.env.VUE_APP_APIRELEASEADDRESS,
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 携带凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json',
};
