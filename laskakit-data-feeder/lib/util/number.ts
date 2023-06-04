export const getPercentFromValue = (maxValue = 100, value = 50): number => (100 * value) / maxValue;
export const getValueFromPercent = (maxValue = 100, percent = 50): number => (maxValue * percent) / 100;