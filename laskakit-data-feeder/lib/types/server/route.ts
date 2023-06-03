import { ReqRef, ReqRefDefaults, RouteOptions, RouteOptionsValidate, ServerRoute } from '@hapi/hapi';
import zod from 'zod';

export type RouteOptionsValidateZod = Omit<RouteOptionsValidate, 'payload' | 'query' | 'params' | 'headers'> & {
  payload?: zod.AnyZodObject | undefined;
  query?: zod.AnyZodObject | undefined;
  params?: zod.AnyZodObject | undefined;
  headers?: zod.AnyZodObject | undefined;
};

interface HapiRouteOptions<
  VALIDATE extends RouteOptionsValidateZod = RouteOptionsValidateZod,
  Refs extends ReqRef = ReqRefDefaults
> extends Omit<RouteOptions<Refs>, 'validate'> {
  validate?: VALIDATE;
}

export interface HapiServerRoute<
  Refs extends ReqRef = ReqRefDefaults,
  VALIDATE extends RouteOptionsValidateZod = RouteOptionsValidateZod
> extends Omit<ServerRoute<Refs>, 'options'> {
  options: HapiRouteOptions<VALIDATE, Refs>;
}