import { useHistory, useLocation } from 'react-router-dom';
import useRequest, { axios } from '@reactseed/use-request';
import useRedux from '@reactseed/use-redux';
import { message } from 'antd';

interface DataProps {
  data: any;
  errorCode: number;
  errMsg: number;
  result: boolean;
}
// handler for old type interface
axios.interceptors.request.use(
  config => {
    const urlArr = (config.url as any).split('/');
    config.url = '/webapi.htm';
    config.params = config.params || {};
    config.params['type'] = urlArr[2];
    config.params['method'] = urlArr[3];

    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  ({ data }) => {
    if (data.errCode !== 0) {
      message.error(data.errMsg);
      return Promise.reject(data);
    }

    // set object outside data into it
    const res = Object.assign({}, data)
    delete res.errCode;
    delete res.errMsg;
    res.data = Object.assign(res.data, {
      ...res
    })
    return res || [];
  },
  function(error) {
    return Promise.reject(error);
  }
);
export { useHistory, useLocation, useRequest, useRedux };
