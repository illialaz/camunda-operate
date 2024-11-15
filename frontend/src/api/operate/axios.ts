import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

import { authStorage } from '../../utils/authStorage';
import { refreshToken } from '../refresh';

interface RequestConfig extends AxiosRequestConfig {
  isRetry?: boolean;
}

const operate = axios.create({
  baseURL: `${process.env.REACT_APP_CAMUNDA_PROXY_URL || ''}/v1/`,
});

operate.interceptors.request.use(
  (config) => {
    const updatedConfig = config;
    const accessToken = authStorage.getAccess();

    if (accessToken) {
      updatedConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return updatedConfig;
  },
  (error) => Promise.reject(error),
);

operate.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfig;

    if (error?.response?.status === 401 && !originalRequest.isRetry) {
      originalRequest.isRetry = true;
      try {
        await refreshToken();

        return await operate(originalRequest);
      } catch (e) {
        authStorage.removeTokens();
        // document.location.reload();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default operate;
