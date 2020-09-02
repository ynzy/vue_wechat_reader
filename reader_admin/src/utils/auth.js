import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return JSON.parse(sessionStorage.getItem(TokenKey))
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, JSON.stringify(token))
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(TokenKey)
}
