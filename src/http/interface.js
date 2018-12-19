import axios from './api';

export const yearClearAllData = params => {
  return axios({
    url: '/TEST',
    method: 'get',
    params,
  });
};

export const monthScheduleTable = params => {
  return axios({
    url: '/MonthlyPlan',
    method: 'get',
    params,
  });
};

export const queryAndAddedUserInfo = params => {
  return axios({
    url: '/Organization',
    method: 'get',
    params,
  });
};

export const queryAndAddedQuery = params => {
  return axios({
    url: '/Review',
    method: 'get',
    params,
  });
};

export const yearLoadingData = params => {
  return axios({
    url: '/Subject',
    method: 'get',
    params,
  });
};

export const yearDataSubmission = params => {
  return axios({
    url: '/Subject',
    method: 'POST',
    data: params,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
};

export const yearUploadFile = params => {
  return axios({
    url: '/ImportExcel',
    method: 'POST',
    data: params,
  });
};

export default {
  monthScheduleTable,
  queryAndAddedUserInfo,
  queryAndAddedQuery,
  yearClearAllData,
  yearLoadingData,
  yearDataSubmission,
  yearUploadFile,
};
