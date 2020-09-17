const express = require('express');
const router = express.Router();
const secretKey = require('../config/secret').JSON_WEB_TOKEN_SECRET;
const TIMApi = require('../services/IMService').Api;
const IMConfig = require('../config/im');
const userDao = require('../dao/userDao');
const jsonwebtoken = require('jsonwebtoken');

const axios = require('axios');

const getMsgTmp = require('../utils/MessageTmpl').default;


function getUserVo(userRawResult) {
  
  const api = new TIMApi(IMConfig.appId, IMConfig.password);
  
  const users = JSON.parse(JSON.stringify(userRawResult));
  const user = users[0];
  const username = user.username;
  
  const userSig = api.genUserSig(username);
  const token = jsonwebtoken.sign( { username }, secretKey);
  return {...user, userSig, token };
}

function createImUser(user) {
  
  
  return new Promise((resolve, reject) => {
    const { username, nickname } = user;
    const timApi = new TIMApi(IMConfig.appId, IMConfig.password);
    const pass = timApi.genUserSig(IMConfig.admin);
    const now = new Date().getTime();
  
    const url = `https://console.tim.qq.com/v4/im_open_login_svc/account_import?sdkappid=${IMConfig.appId}&identifier=${IMConfig.admin}&usersig=${pass}&random=$${now}&contenttype=json`
    const postBody = {
      Identifier: username,
      Nick: nickname,
      FaceUrl:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2395111507,1568947277&fm=26&gp=0.jpg"
    }
    axios.post(url, postBody).then((res)=> {
      if(res.data.ErrorCode != 0) {
        reject(new Error(res.data.ErrorInfo));
        return;
      }
      resolve(res.data);
    }).catch(reject);
  })
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
    
    try {
      const imResult = await createImUser({username, nickname});
      console.log(imResult);
      await userDao.create(username, nickname, password);
      const result = await userDao.query(username);
      const curUser = getUserVo(result);
      res.send(getMsgTmp(0, "成功", "成功", curUser ));
    }catch(e) {
      res.send(getMsgTmp(500, "处理失败", e.message, {}));
      return ;
    }
    
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
});


router.get('/', async function(req, res, next) {

});
module.exports = router;
