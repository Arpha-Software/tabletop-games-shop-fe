export function getCookieParam(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(name))
    ?.split('=')[1];
}

export function setCookieParam(name: string, value: string, expires: string = 'Fri, 31 Dec 9999 23:59:59 GMT') {
  document.cookie = `${name}=${value};  expires=${expires}; SameSite=Lax`;
}

export function resetCookieParam(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
