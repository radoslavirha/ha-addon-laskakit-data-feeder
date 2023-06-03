import Hapi from '@hapi/hapi';
import Axios, { AxiosResponse, RawAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

import { type HapiPluginWithApplicationState } from '../types/server/plugin';


const plugin: HapiPluginWithApplicationState<null> = {
  name: 'axios',
  register: async (server): Promise<void> => {
    const http = Axios;

    axiosRetry(http, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

    const retry = async <T = unknown>(config: RawAxiosRequestConfig<T>, retries = 3): Promise<AxiosResponse<T>> => await http.request<T>({
      ...config,
      'axios-retry': { retry: retries }
    } as RawAxiosRequestConfig<T>);

    server.app.axios = retry;
  }
};

export default plugin as Hapi.Plugin<null>;
