
const express = require('express');
const router = express.Router();

const dayjs = require('dayjs');
const mysql = require('mysql');
const config = require('../config/db');

const $sql = {
  insert: "INSERT INTO user(username, nickname, avatar, password, create_at, update_at) values" +
    "(?, ?, ?, ?, ?, ?)",
  update: "UPDATE USER SET nickname=?, avatar=?, password=?, update_at=now() where username = ?",
  delete: "DELETE FROM USER WHERE username = ?",
  query: "select username username, nickname nickname, avatar avatar, password password, " +
    "create_at createAt, update_at updateAt from user where username = ?",
  queryAll: "select username username, nickname nickname, avatar avatar, create_at createAt, update_at updateAt from user"
}

const pool = mysql.createPool(config.mysql);

module.exports = {
  create: function(username, nickname, password) {
    const avatarUrl = "/images/quanyecha.jpg";
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    return new Promise((resolve, reject)=> {
      pool.getConnection(function (errno, connection) {
        connection.query($sql.insert, [username, nickname, avatarUrl, password, now, now], function (err, result) {
          
          if(err) reject(err);
          else resolve(result);
          connection.release();
        });
      });
    });
  },
  
  query: function(username) {
    return new Promise((resolve, reject) => {
      pool.getConnection((function (errno, connection) {
        if(errno) return reject(new Error("获取数据库连接失败"));
        connection.query($sql.query, [ username ], function (err, result) {
          if(err) reject(err);
          else resolve(result);
        });
        connection.release();
      }))
    })
  },
  
  queryAll: function() {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (errno, connection) {
        if(errno) return reject(new Error('获取数据库连接失败'));
        connection.query($sql.queryAll, [], function(err, result) {
          if(err) reject(err);
          else resolve(result);
        });
        connection.release();
      })
    })
  }
}