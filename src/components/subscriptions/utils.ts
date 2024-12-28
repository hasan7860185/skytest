export const generatePathSegment = (companyName: string): string => {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateSubdomain = (companyName: string): string => {
  const timestamp = Date.now().toString().slice(-4);
  const base = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 10);
  return `${base}${timestamp}`;
};