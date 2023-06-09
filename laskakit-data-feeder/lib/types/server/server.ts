import Hapi from '@hapi/hapi';
import { AxiosResponse, RawAxiosRequestConfig } from 'axios';
import type Winston from 'winston';

import { RainService } from '../../plugins/rain-service';

export interface IBaseServerApplicationState {
  axios: <T = unknown>(request: RawAxiosRequestConfig<T>, retries?: number) => Promise<AxiosResponse<T>>;
  logger: Winston.Logger;
  options: {
    IMAGE_TO_CONSOLE: boolean;
    LASKAKIT_URL: string;
    LOG_LEVEL: string;
  };
  version: string;
  rainService: RainService;
}

export class BaseServerWithState extends Hapi.Server<IBaseServerApplicationState> {}
