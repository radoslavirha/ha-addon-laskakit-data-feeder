import type Hapi from '@hapi/hapi';

import { type BaseServerWithState } from './server';

interface IHapiPluginBase<T> extends Omit<Hapi.PluginBase<T, unknown>, 'register'> {
  register: (server: BaseServerWithState, options: T) => void | Promise<void>;
}

export type HapiPluginWithApplicationState<T> = IHapiPluginBase<T> & (Hapi.PluginNameVersion | Hapi.PluginPackage);
