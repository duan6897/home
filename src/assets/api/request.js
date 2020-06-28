import httpRequest from './httpRequest'

export default {

  get (url, options, success, error) {
    httpRequest.get(url, options).then(res => {
      success && success(res);
    }).catch(err => {
      error && error(err)
    })
  },
  post (url, options, success, error) {
    httpRequest.post(url, options).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    })
  },
  postP (url, options, success, error) {
    httpRequest.post(url, options).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    })
  },
  postFile (url, options, success, error) {
    httpRequest.post(url, options).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    })
  },
  put (url, options, success, error) {
    httpRequest.put(url, options).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    })
  },
  delete (url, options, success, error) {
    httpRequest.delete(url, options).then(res => {
      success && success(res)
    }).catch(err => {
      error && error(err)
    })
  },
}