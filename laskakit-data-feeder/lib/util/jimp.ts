import { RGBA } from '@jimp/core';
import Jimp from 'jimp';

export type RGBAWithIdx = RGBA & { idx: number };

// Jimp scans from top left to bottom right using width, height
// We offset x,y by buffer to get the correct corner
export const getPixelWithBuffer = async (x: number, y: number, image: Jimp, buffer = 0): Promise<RGBAWithIdx[]> => {
  const pixels: RGBAWithIdx[] = [];

  const xBase = buffer === 0 ? x : x - buffer;
  const yBase = buffer === 0 ? y : y - buffer;
  const w = (buffer * 2) + 1;
  const h = (buffer * 2) + 1;

  image.scan(xBase, yBase, w, h, (x, y, idx) => {
    if (idx >= 0) {
      pixels.push({ ...Jimp.intToRGBA(image.getPixelColor(x, y)), idx });
    }
  });

  return pixels;
};

export default {
  getPixelWithBuffer
};