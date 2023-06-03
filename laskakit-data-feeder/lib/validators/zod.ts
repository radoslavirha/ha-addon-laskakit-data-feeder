import zod from 'zod';

export const RouteValidatorZOD = {
  compile: (schema: zod.Schema): { validate: (val: unknown) => void } => ({
    validate: (val: unknown): unknown => schema.parse(val)
  })
};
export type RouteValidatorZOD = typeof RouteValidatorZOD;