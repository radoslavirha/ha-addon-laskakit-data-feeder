import Boom from '@hapi/boom';
import { AxiosError } from 'axios';
import Jimp from 'jimp';
import joinImages from 'join-images';

import Cities from '../data/cities.json';
import { BBOX } from '../types/common';
import { IRouteGetRainRefs } from '../types/routes/rain';
import { HapiHandler } from '../types/server/handler';
import { getCHMIUTCDate } from '../util';
import { getCityRGBA } from '../util/city';
import { cityValidator } from '../validators/schemas';

/**
 * GET /rain?pixelBuffer={number}
 */
export const rain: HapiHandler<IRouteGetRainRefs> = async (request, h) => {
  const { axios, logger } = request.server.app,
    query = request.query,
    { IMAGE_TO_CONSOLE } = request.server.app.options;

  try {
    // correct bbox definition
    const bbox: BBOX = {
      left: 11.267,
      bottom: 48.048,
      right: 20.770,
      top: 52.167
    };

    const url = `https://www.chmi.cz/files/portal/docs/meteo/rad/inca-cz/data/czrad-z_max3d_masked/pacz2gmaps3.z_max3d.${getCHMIUTCDate()}.0.png`;

    logger.debug(`Downloading rain image from ${url}`);

    const reponse = await axios<Buffer>({ method: 'GET', url, responseType: 'arraybuffer' });

    const image = await Jimp.read(reponse.data);

    if (!image.hasAlpha()) {
      throw new Error(`Image does not have alpha channel!`);
    }

    const imageToCompare = new Jimp(image.getWidth(), image.getHeight());

    const citiesCount = Cities.length;

    if (citiesCount !== 72) {
      throw new Error(`Found only ${citiesCount} cities!`);
    }

    const rainyCities: {id: number; r: number; g: number; b: number }[] = [];

    for (let i = 0; i < citiesCount; i++) {
      try {
        cityValidator.parse(Cities[i]);
      } catch (error) {
        logger.warn(`${Cities[i].city} failed validation!`);
        continue;
      }

      const { id, city } = Cities[i];

      const { pixels } = await getCityRGBA(Cities[i], bbox, image, query.pixelBuffer);

      const r = Math.max(...pixels.map(p => p.r)),
        g = Math.max(...pixels.map(p => p.g)),
        b = Math.max(...pixels.map(p => p.b)),
        a = Math.max(...pixels.map(p => p.a ?? 255));

      if (r + g + b > 0) {
        logger.debug(`${city} is rainy. RGB: ${r}, ${g}, ${b}, ${a}`);

        rainyCities.push({ id, r, g, b });

        for (const pixel of pixels) {
          imageToCompare.bitmap.data[pixel.idx] = r;
          imageToCompare.bitmap.data[pixel.idx + 1] = g;
          imageToCompare.bitmap.data[pixel.idx + 2] = b;
          imageToCompare.bitmap.data[pixel.idx + 3] = a;
        }
      }
    }

    if (IMAGE_TO_CONSOLE) {
      try {
        const visualResponse = await joinImages([
          await imageToCompare.getBufferAsync(Jimp.MIME_PNG),
          await image.getBufferAsync(Jimp.MIME_PNG)
        ], { direction: 'horizontal' });

        const terminal = (await import('terminal-image')).default;
        // eslint-disable-next-line no-console
        console.log(await terminal.buffer(await visualResponse.png().toBuffer(), { height: '25%', preserveAspectRatio: false }));
      } catch (error) {
        logger.debug(`Failed to render images to console!`);
      }
    }

    if (rainyCities.length) {
      try {
        const body = new FormData();
        body.append('mesta', JSON.stringify(rainyCities));

        logger.debug(`Sending data to LaskaKit on ${request.server.app.options.LASKAKIT_URL}`);

        await axios({
          method: 'POST',
          url: request.server.app.options.LASKAKIT_URL,
          data: rainyCities,
          headers: { 'Content-Type': 'multipart/form-data' }
        }, 3);

        logger.debug(`Succesfully sent data to LaskaKit!`);
      } catch (error) {
        throw new Error(`Failed to send data to LaskaKit after 3 attempts! ${request.server.app.options.LASKAKIT_URL}`);
      }
    } else {
      logger.debug(`Everywhere is sunny!`);
    }
  } catch (error) {
    logger.warn((error as AxiosError).message);
    return Boom.badRequest((error as AxiosError).message);
  }

  return h.response('OK').code(200);
};

export default {
  rain
};