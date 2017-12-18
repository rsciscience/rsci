import axios from 'axios'
import url from 'url'

var location = url.parse(window.location.href)
export const HTTP = axios.create({
  baseURL: 'http://' + location.hostname + ':3003/'

})
