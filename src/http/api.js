import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import config from './config';

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseURL,
      headers: {},
    });

    instance.interceptors.request.use(
      (config) => {
        if (config.method.toLocaleLowerCase() === 'post' && config.url !== '/ImportExcel') {
          config.data = qs.stringify(config.data);
        }
        return config;
      },
      (error) => {
        Message({
          showClose: true,
          message: error && error.data.error.message,
          type: 'error',
        });
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      response => response,
      err => Promise.reject(err.message),
    );

    // 具体细节见https://juejin.im/post/5ae432aaf265da0b9c1063c8;
    instance(options)
      .then((res) => {
        resolve(res);
        return false;
      })
      .catch((error) => {
        reject(error);
      });
  });
}
