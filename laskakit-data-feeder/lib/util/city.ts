import Jimp from 'jimp';

import { BBOX } from '../types/common';
import { City } from '../validators/schemas';
import { getPixelWithBuffer, RGBAWithIdx } from './jimp';
import { getPercentFromValue, getValueFromPercent } from './number';

export const getCityRGBA = async (City: City, bbox: BBOX, image: Jimp, buffer = 0): Promise<{
  x: number;
  y: number;
  pixels: RGBAWithIdx[];
}> => {
  const { latitude, longitude } = City;

  const lonDiff = bbox.right - bbox.left,
    latDiff = bbox.top - bbox.bottom,
    fromLeft = getPercentFromValue(lonDiff, longitude - bbox.left),
    fromTop = 100 - getPercentFromValue(latDiff, latitude - bbox.bottom);

  const x = Math.round(getValueFromPercent(image.getWidth(), fromLeft)),
    y = Math.round(getValueFromPercent(image.getHeight(), fromTop));

  return {
    x,
    y,
    pixels: await getPixelWithBuffer(x, y, image, buffer)
  };
};