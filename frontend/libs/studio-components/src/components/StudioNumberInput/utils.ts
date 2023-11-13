export const isStringValidDecimalNumber = (value: string): boolean => {
  if (!value) return true;
  const numberRegex = /^[0-9]+([.,][0-9]*)?$/;
  return numberRegex.test(value);
};

export const convertStringToNumber = (value: string): number =>
  value ? Number(value.replace(',', '.')) : undefined;

export const convertNumberToString = (value?: number): string =>
  value?.toString().replace('.', ',') || '';
