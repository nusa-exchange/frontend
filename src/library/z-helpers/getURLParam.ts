export const getURLParam = (url: string, param: string) => new URL(url).searchParams.get(param);
