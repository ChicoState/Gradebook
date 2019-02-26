import Cookies from 'universal-cookie'
import decode from 'jwt-decode'
const cookies = new Cookies()

// get auth header to send in axios API requests
export function getHeader () {
  return { 'x-access-token' : getToken() }
}

// get token from cookies
export function getToken() {
  return cookies.get('token')
}

// set token to cookies 
export function setToken (token) {
  cookies.set('token', token, { path: '/' })
}

// check if user is logged in
export function isLoggedIn() {
  const token = getToken() || false
  let authorized = !!token && !isTokenExpired()
  return authorized
}

// check if token is expired
export function isTokenExpired() {
  const expirationDate = getTokenExpirationDate(getToken())
  return expirationDate < new Date()
}

export function getTokenExpirationDate(token) {
  const decodedToken = decode(token)
  if (!decodedToken.exp) { return null }
  const date = new Date(0)
  date.setUTCSeconds(decodedToken.exp)
  return date;
}