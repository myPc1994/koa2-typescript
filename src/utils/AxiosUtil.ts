import axios from "axios";

const instance = axios.create();
// POST传参序列化(添加请求拦截器)
// instance.interceptors.request.use(config => {
//     return config;
// }, error => {
//     return Promise.reject(error.data.error.message);
// });
// 返回状态判断(添加响应拦截器)
instance.interceptors.response.use(res => [res.data, null], error => [null, error]);
export const AxiosUtil = instance;