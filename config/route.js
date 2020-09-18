

const nonAuthenticatedUrl = [
  '/users/login',
  '/users/create',
  '/images/**'
]

module.exports.isNonAuthenticatedUrl = function (url) {
  if(!url.startsWith('/')) url = '/' + url;
  let authentication = false;
  
  for(let i = 0; i < nonAuthenticatedUrl.length; i++) {
    let item = nonAuthenticatedUrl[i];
    if(item.endsWith('/**')) {
      item = item.replace('/**','');
      if(url.indexOf(item) !== -1) {
        authentication = true;
        break;
      }
    }else {
      if(item.indexOf(url) !== -1 && item.length === url.length) {
        authentication = true;
        break;
      }
    }
  }

  return authentication;
}
