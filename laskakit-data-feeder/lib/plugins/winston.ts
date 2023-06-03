import type Hapi from '@hapi/hapi';
import Winston from 'winston';

import { type HapiPluginWithApplicationState } from '../types/server/plugin';

const plugin: HapiPluginWithApplicationState<null> = {
  name: 'winston',
  register: async (server): Promise<void> => {
    const levels = {
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
      },
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue',
        debug: 'cyan'
      }
    };

    const logger = Winston.createLogger({
      levels: levels.levels,
      level: server.app.options.LOG_LEVEL
    });

    const addVersion = Winston.format(info => {
      info.version = server.app.version;
      return info;
    });

    logger.add(new Winston.transports.Console({
      format: Winston.format.combine(
        addVersion(),
        Winston.format.timestamp(),
        Winston.format.json()
      )
    }));

    Winston.addColors(levels.colors);
    server.app.logger = logger;
  }
};

export default plugin as Hapi.Plugin<null>;
