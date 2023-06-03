import zod from 'zod';

export const getRainQueryValidator = zod.object({
  pixelBuffer: zod.coerce.number().int().min(0).default(0)
});

export type RainQuery = zod.infer<typeof getRainQueryValidator>;