import Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';

import { type HapiPluginWithApplicationState } from '../types/server/plugin';

// Swagger UI does not show parsed payload/params/query/headers validators. It's built for Joi, not Zod.
// Requested feature:
// https://github.com/hapi-swagger/hapi-swagger/issues/804#issue-1734729569

const plugin: HapiPluginWithApplicationState<null> = {
  name: 'swagger',
  register: async (server): Promise<void> => {
    await server.register(Inert);
    await server.register(Vision);
    await server.register({
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'REST API',
          description: 'Data Feeder for LaskaKit interactive map of Czech republic',
          version: server.app.version,
          contact: {
            name: 'Radoslav Irha',
            email: 'radoslav.irha@gmail.com'
          }
        },
        cors: true,
        documentationPage: true,
        documentationPath: '/documentation',
        schemes: [ 'http' ],
        sortEndpoints: 'ordered',
        swaggerUI: true,
        auth: false
      }
    });
  }
};

export default plugin as Hapi.Plugin<null>;
