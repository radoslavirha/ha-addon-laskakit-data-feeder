import Hapi from '@hapi/hapi';
import Jimp from 'jimp';
import joinImages from 'join-images';

import Cities from '../data/cities.json';
import { BBOX } from '../types/common';
import { type HapiPluginWithApplicationState } from '../types/server/plugin';
import { IBaseServerApplicationState } from '../types/server/server';
import { getCHMIUTCDate } from '../util';
import { getCityRGBA } from '../util/city';
import { cityValidator } from '../validators/schemas';

// correct bbox definition
const bbox: BBOX = {
  left: 11.267,
  bottom: 48.048,
  right: 20.770,
  top: 52.167
};

export class RainService {
  private _app: IBaseServerApplicationState;

  constructor(app: IBaseServerApplicationState) {
    this._app = app;
  }

  private getCities(): { id: number; city: string; latitude: number; longitude: number }[] {
    const citiesCount = Cities.length;

    if (citiesCount !== 72) {
      throw new Error(`Found only ${citiesCount} cities!`);
    }

    for (let i = 0; i < citiesCount; i++) {
      try {
        cityValidator.parse(Cities[i]);
      } catch (error) {
        const err = `${Cities[i].city} failed validation!`;
        this.app.logger.warn(err);
        throw new Error(err);
      }
    }

    return Cities;
  }

  async getRainImage(): Promise<Jimp> {
    const url = `https://www.chmi.cz/files/portal/docs/meteo/rad/inca-cz/data/czrad-z_max3d_masked/pacz2gmaps3.z_max3d.${getCHMIUTCDate()}.0.png`;

    this.app.logger.debug(`Downloading rain image from ${url}`);

    const reponse = await this.app.axios<Buffer>({ method: 'GET', url, responseType: 'arraybuffer' });

    const image = await Jimp.read(reponse.data);

    if (!image.hasAlpha()) {
      throw new Error(`Image does not have alpha channel!`);
    }

    return image;
  }

  async getJoinedImagesBuffer(left: Jimp, right: Jimp): Promise<Buffer> {
    const joined = await joinImages([
      await left.getBufferAsync(Jimp.MIME_PNG),
      await right.getBufferAsync(Jimp.MIME_PNG)
    ], { direction: 'horizontal' });

    return joined.png().toBuffer();
  }

  async processCities(image: Jimp, emptyImage: Jimp, pixelBuffer: number): Promise<{ rainyCities: {id: number; r: number; g: number; b: number }[]; rainyImage: Jimp }> {
    const rainyCities: {id: number; r: number; g: number; b: number }[] = [];

    const cities = this.getCities();

    for (let i = 0; i < cities.length; i++) {
      const { id, city } = Cities[i];

      const { pixels } = await getCityRGBA(Cities[i], bbox, image, pixelBuffer);

      const r = Math.max(...pixels.map(p => p.r)),
        g = Math.max(...pixels.map(p => p.g)),
        b = Math.max(...pixels.map(p => p.b)),
        a = Math.max(...pixels.map(p => p.a ?? 255));

      if (r + g + b > 0) {
        this.app.logger.debug(`${city} is rainy. RGB: ${r}, ${g}, ${b}, ${a}`);

        rainyCities.push({ id, r, g, b });

        for (const pixel of pixels) {
          emptyImage.bitmap.data[pixel.idx] = r;
          emptyImage.bitmap.data[pixel.idx + 1] = g;
          emptyImage.bitmap.data[pixel.idx + 2] = b;
          emptyImage.bitmap.data[pixel.idx + 3] = a;
        }
      }
    }

    return { rainyCities, rainyImage: emptyImage };
  }

  get app(): IBaseServerApplicationState { return this._app; }
}

const plugin: HapiPluginWithApplicationState<null> = {
  name: 'rain-service',
  register: async (server): Promise<void> => {

    server.app.rainService = new RainService(server.app);
  }
};

export default plugin as Hapi.Plugin<null>;
