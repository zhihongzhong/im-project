

const nonAuthenticatedUrl = [
  '/users/login',
  '/users/create'
]

module.exports.isNonAuthenticatedUrl = function (url) {
  if(!url.startsWith('/')) url = '/' + url;
  return nonAuthenticatedUrl.indexOf(url) !== -1;
}
