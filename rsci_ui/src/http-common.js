import axios from 'axios'
import url from 'url'

var location = url.parse(window.location.href)
var baseURL = 'http://' + location.hostname + ':3003/'

const HTTP = axios.create({
  baseURL: baseURL
})
HTTP.baseURL = baseURL
export { HTTP }
