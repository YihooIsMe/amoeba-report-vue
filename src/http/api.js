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
        if (config.method.toLocaleLowerCase() === 'post' && typeof config.data.get !== 'function') {
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
      (response) => {
        /*
        if (response.data && !response.data.success) {
          Message({
            showClose: true,
            message: response.data.error.message.message
              ? response.data.error.message.message
              : response.data.error.message,
            type: 'error',
          });
          return Promise.reject(response.data.error.message);
        }
        */
        return response;
      },
      (err) => {
        // let errInfo;
        // if (err && err.response) {
        //   switch (err.response.status) {
        //     case 400:
        //       errInfo.message = '请求错误';
        //       break;
        //     case 401:
        //       errInfo.message = '未授权，请登录';
        //       break;
        //     case 403:
        //       errInfo.message = '拒绝访问';
        //       break;
        //     case 404:
        //       errInfo.message = `请求地址出错: ${err.response.config.url}`;
        //       break;
        //     case 408:
        //       errInfo.message = '请求超时';
        //       break;
        //     case 500:
        //       errInfo.message = '服务器内部错误';
        //       break;
        //     case 501:
        //       errInfo.message = '服务未实现';
        //       break;
        //     case 502:
        //       errInfo.message = '网关错误';
        //       break;
        //     case 503:
        //       errInfo.message = '服务不可用';
        //       break;
        //     case 504:
        //       errInfo.message = '网关超时';
        //       break;
        //     case 505:
        //       errInfo.message = 'HTTP版本不受支持';
        //       break;
        //     default:
        //   }
        // }
        return Promise.reject(err.message);
      },
    );

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
