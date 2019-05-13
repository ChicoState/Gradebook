import Cookies from 'universal-cookie'
import decode from 'jwt-decode'
import axios from 'axios'
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
export async function setToken (token) {
  await cookies.set('token', token, { path: '/' })
}

// check if user is logged in
export function isLoggedIn() {
  const token = getToken() || false
  console.log(token)
  let authorized = !!token && !isTokenExpired()
  return authorized
}

export async function getUser() {
  let user = await axios.get('user/me', { headers: getHeader() })
  return user.data
}

export function resetToken () {
  cookies.remove('token', { path: '/' })
  cookies.remove('csrf_token', { path: '/' })
}

export function logout() {
  resetToken()
  window.location.reload()
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