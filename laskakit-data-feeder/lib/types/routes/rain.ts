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

/**
 * GET /rain/image?pixelBuffer={number}
 */
export interface IRouteGetRainImageRefs {
  Query: RainQuery;
}

export interface IRouteGetRainImageValidation {
  query: typeof getRainQueryValidator;
}