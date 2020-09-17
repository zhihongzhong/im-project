
const jsonwebtoken = require('jsonwebtoken');
const secretKey = require('../config/secret').JSON_WEB_TOKEN_SECRET;
const getMsgTmp = require('../utils/MessageTmpl').default;
const route = require('../config/route');

function authentication(req, res, next) {
  
  if(route.isNonAuthenticatedUrl(req.path)) {
    next();
    return;
  }
  
  const token = req.headers.token;
  if(token == null) {
    res.send(getMsgTmp(904, "认证失败", "未找到token", {}));
    return;
  }
  else{
    try {
      const jwt = jsonwebtoken.decode(token, secretKey);
      req.username = jwt.username;
      next();
    }catch(e) {
      console.log(e);
      res.send(getMsgTmp(905, "解析token失败", "解析token失败", {}));
    }
  }
}


module.exports = {
  authentication
}