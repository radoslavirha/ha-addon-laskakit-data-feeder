import Boom from '@hapi/boom';
import { AxiosError } from 'axios';
import Jimp from 'jimp';

import { IRouteGetRainImageRefs, IRouteGetRainRefs } from '../types/routes/rain';
import { HapiHandler } from '../types/server/handler';

/**
 * GET /rain?pixelBuffer={number}
 */
export const rain: HapiHandler<IRouteGetRainRefs> = async (request, h) => {
  const { axios, logger, rainService } = request.server.app,
    query = request.query,
    { IMAGE_TO_CONSOLE } = request.server.app.options;

  let response;

  try {
    const image = await rainService.getRainImage();
    const emptyImage = new Jimp(image.getWidth(), image.getHeight());

    const { rainyCities, rainyImage } = await rainService.processCities(image, emptyImage, query.pixelBuffer);

    response = rainyCities;

    if (IMAGE_TO_CONSOLE) {
      try {
        const visualResponse = await rainService.getJoinedImagesBuffer(rainyImage, image);

        const terminal = (await import('terminal-image')).default;
        // eslint-disable-next-line no-console
        console.log(await terminal.buffer(await visualResponse, { height: '25%', preserveAspectRatio: false }));
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

  return h.response(response).code(200);
};

/**
 * GET /rain/image?pixelBuffer={number}
 */
export const rainImage: HapiHandler<IRouteGetRainImageRefs> = async (request, h) => {
  const { rainService, logger } = request.server.app,
    query = request.query;

  let visualResponse;

  try {
    const image = await rainService.getRainImage();
    const emptyImage = new Jimp(image.getWidth(), image.getHeight());

    const { rainyImage } = await rainService.processCities(image, emptyImage, query.pixelBuffer);

    visualResponse = await rainService.getJoinedImagesBuffer(rainyImage, image);
  } catch (error) {
    logger.warn((error as AxiosError).message);
    return Boom.badRequest((error as AxiosError).message);
  }

  return h.response(visualResponse)
    .type(Jimp.MIME_PNG);
};

export default {
  rain,
  rainImage
};