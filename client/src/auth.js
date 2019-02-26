import Cookies from 'universal-cookie'
const cookies = new Cookies()

export function getHeader () {
  return { 'x-access-token' : getToken() }
}

export function getToken() {
  return cookies.get('token')
}

export function setToken (token) {
  cookies.set('token', token, { path: '/' })
}