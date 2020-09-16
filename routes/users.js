const express = require('express');
const router = express.Router();
const secretKey = require('../config/secret').JSON_WEB_TOKEN_SECRET;
const TIMApi = require('../services/IMService').Api;
const IMConfig = require('../config/im');
const userDao = require('../dao/userDao');
const jsonwebtoken = require('jsonwebtoken');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'express项目'})
});


function getMsgTmp(code, msg, errMsg, data) {
  return {
    code,
    msg,
    errMsg,
    data
  }
}


function getUserVo(userRawResult) {
  
  const api = new TIMApi(IMConfig.appId, IMConfig.password);
  
  const users = JSON.parse(JSON.stringify(userRawResult))
  const user = users[0];
  const username = user.username;
  
  const userSig = api.genUserSig(username);
  const token = jsonwebtoken.sign( { username }, secretKey);
  return {...user, userSig, token };
}


router.post('/create', async function(req, res, next) {
  const { username, password, confirm } = req.body;
  if(password !== confirm) {
    res.send(getMsgTmp(900, "两次输入密码不一致", "两次输入密码不一致", {}));
    return;
  }
  
  
  const user = await userDao.query(username);
  if(user.length <= 0) {
    
    const now = new Date().getTime();
    const nickname = '用户_' + now.toFixed(4);
    await userDao.create(username, nickname, password);
    const result = await userDao.query(username);
    const curUser = getUserVo(result);
    
    res.send(getMsgTmp(0, "成功", "成功", curUser ));
  }else {
    res.send(getMsgTmp(901, "该用户已经存在", "该用户已经存在", {}))
  }
  
});

router.post('/login', async function( req, res, next ){
  const { username, password } = req.body;
  
  const users = await userDao.query(username);
  
  if(users.length <= 0) {
    res.send(getMsgTmp(902, "该用户不存在", "该用户不存在", {}));
    return;
  }
  
  const user = getUserVo(users);
  if(user.password === password) {
    res.send(getMsgTmp(0, "成功", "成功", user));
    return
  }else {
    res.send(getMsgTmp(903, "密码不正确", "密码不正确", {}));
    return;
  }
})


module.exports = router;
