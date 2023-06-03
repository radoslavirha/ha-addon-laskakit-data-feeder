import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
// @ts-expect-error: missing types
import HauteCouture from '@hapipal/haute-couture';
import Path from 'path';
import yn from 'yn';
import { ZodError } from 'zod';

import PackageJson from '../package.json';
import { type IBaseServerApplicationState } from './types/server/server';
import { RouteValidatorZOD } from './validators/zod';

const getIp = (request: Hapi.Request): string =>
  request.headers['x-real-ip'] ||
  request.headers['x-forwarded-for'] ||
  request.info.remoteAddress;

const init = async (): Promise<void> => {
  const options = {
    IMAGE_TO_CONSOLE: yn(process.env.IMAGE_TO_CONSOLE, { default: false }),
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
    LASKAKIT_URL: ''
  };

  const server = new Hapi.Server<IBaseServerApplicationState>({
    port: 8000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: [ '*' ]
      },
      validate: {
        failAction: async (request, _h, err): Promise<void> => {
          if (options.LOG_LEVEL === 'debug') {
            if (err instanceof ZodError) {
              server.app.logger.error(err.issues[0].message, { meta: `${request.method.toUpperCase()} ${request.path} from ${getIp(request)}` });
              const boom = Boom.badRequest(err.issues[0].message);
              // Similar to Joi error processed by Hapi
              // @hapi/hapi/lib/validation.js ~line 148
              boom.output.payload.validation = err.issues[0];
              throw boom;
            }
            // During development, log and respond with the full error.
            server.app.logger.error((err as Error).message, { meta: `${request.method.toUpperCase()} ${request.path} from ${getIp(request)}` });
            throw err;
          }

          throw Boom.badRequest('Invalid request payload input');
        }
      }
    }
  });

  server.app.version = PackageJson.version;
  server.app.options = options;

  // @ts-expect-error: Expects Joi
  server.validator(RouteValidatorZOD);

  await server.register([
    {
      plugin: {
        name: 'haute-couture',
        register: async (server): Promise<void> => {
          await HauteCouture.compose(server, undefined, {
            dirname: Path.join(__dirname),
            amendments: {
              auth: false,
              bind: false,
              caches: false,
              cookies: false,
              decorations: false,
              dependencies: false,
              expose: false,
              extensions: false,
              methods: false,
              models: false,
              path: false,
              plugins: HauteCouture.amendment('plugins'),
              routes: HauteCouture.amendment('routes', { recursive: true }),
              services: false,
              subscriptions: false,
              validators: false,
              'view-manager': false
            }
          });
        }
      }
    }
  ]);

  // Wait for logger
  if (!process.env.LASKAKIT_URL) {
    server.app.logger.error('LASKAKIT_URL is not set');
    process.exit(1);
  }

  server.app.options.LASKAKIT_URL = process.env.LASKAKIT_URL;

  server.ext('onRequest', (request, h) => {
    server.app.logger.debug(`${request.method.toUpperCase()} ${request.path} from ${getIp(request)}`);
    return h.continue;
  });

  const _handleProcessExit = (code: NodeJS.Signals): void => {
    server.app.logger.info(`${code}: Gracefully shutting down ...`);

    server.stop({ timeout: 10000 })
      .then(() => {
        process.exit(0);
      })
      .catch(err => {
        server.app.logger.warn(err);
        process.exit(1);
      });
  };

  process.on('SIGINT', code => {
    _handleProcessExit(code);
  });
  process.on('SIGQUIT', code => {
    _handleProcessExit(code);
  });
  process.on('SIGTERM', code => {
    _handleProcessExit(code);
  });

  server.app.logger.info('Options:');
  server.app.logger.info(server.app.options);

  await server.start();

  server.app.logger.info(`Server running on ${server.info.uri}`);
};

void init();
