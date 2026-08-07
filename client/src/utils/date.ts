export const formatIsoToLocal = (isoDate: string) => {
  return new Date(isoDate).toLocaleString();
};
