import { getRainQueryValidator, RainQuery } from '../../validators/routes/rain';

/**
 * GET /rain?pixelBuffer={number}
 */
export interface IRouteGetRainRefs {
  Query: RainQuery;
}

export interface IRouteGetRainValidation {
  query: typeof getRainQueryValidator;
}