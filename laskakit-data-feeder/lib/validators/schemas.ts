import zod from 'zod';

export const cityValidator = zod.object({
  id: zod.number().int().min(0),
  city: zod.string(),
  latitude: zod.number().min(-90).max(90),
  longitude: zod.number().min(-180).max(180)
});

export type City = zod.infer<typeof cityValidator>;