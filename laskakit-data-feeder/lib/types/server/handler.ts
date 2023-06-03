import Hapi from '@hapi/hapi';

import { BaseServerWithState } from './server';

export type RequestRefs<REFS extends Hapi.ReqRef = Hapi.ReqRefDefaults> = REFS;

export type HapiRequest<REFS extends Hapi.ReqRef = Hapi.ReqRefDefaults> = {
  server: BaseServerWithState;
} & Hapi.Request<RequestRefs<REFS>>;
type HapiMethod<REFS extends Hapi.ReqRef = Hapi.ReqRefDefaults> = (request: HapiRequest<REFS>, h: Hapi.ResponseToolkit, err?: Error | undefined) => Hapi.Lifecycle.ReturnValue;
export type HapiHandler<REFS extends Hapi.ReqRef = Hapi.ReqRefDefaults> = Hapi.HandlerDecorations & HapiMethod<REFS>;