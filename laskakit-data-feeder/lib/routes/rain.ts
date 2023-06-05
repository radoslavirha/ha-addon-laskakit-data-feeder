import Controller from '../handlers/rain';
import { IRouteGetRainImageRefs, IRouteGetRainImageValidation, IRouteGetRainRefs, IRouteGetRainValidation } from '../types/routes/rain';
import { HapiServerRoute } from '../types/server/route';
import { getRainQueryValidator } from '../validators/routes/rain';

const rain: HapiServerRoute<IRouteGetRainRefs, IRouteGetRainValidation> = {
  method: 'GET',
  path: `/rain`,
  handler: Controller.rain,
  options: {
    auth: false,
    description: 'Send rain data to LaskaKit',
    notes: [],
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'OK' },
          400: { description: 'Bad Request' }
        }
      }
    },
    tags: [ 'api' ],
    validate: {
      query: getRainQueryValidator
    }
  }
};

const rainImage: HapiServerRoute<IRouteGetRainImageRefs, IRouteGetRainImageValidation> = {
  method: 'GET',
  path: `/rain/image`,
  handler: Controller.rainImage,
  options: {
    auth: false,
    description: 'Returns radar and current conditions image',
    notes: [],
    plugins: {
      'hapi-swagger': {
        responses: {
          200: { description: 'Radar and current conditions image', content: { 'image/png': { schema: { type: 'string', format: 'binary' } } } },
          400: { description: 'Bad Request' }
        },
        produces: [ 'application/json', 'image/png' ]
      }
    },
    tags: [ 'api' ],
    validate: {
      query: getRainQueryValidator
    }
  }
};

export default [
  rain,
  rainImage
];