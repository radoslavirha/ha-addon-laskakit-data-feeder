import Controller from '../handlers/rain';
import { IRouteGetRainRefs, IRouteGetRainValidation } from '../types/routes/rain';
import { HapiServerRoute } from '../types/server/route';
import { getRainQueryValidator } from '../validators/routes/rain';

const rain: HapiServerRoute<IRouteGetRainRefs, IRouteGetRainValidation> = {
  method: 'GET',
  path: `/rain`,
  handler: Controller.rain,
  options: {
    auth: false,
    description: 'Rain',
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

export default [
  rain
];