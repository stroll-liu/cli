#!/usr/bin/env node
// const inquirer = require('inquirer'); // 与用户交互
// const figlet = require('figlet'); // LOGO生成器
// const chalk = require('chalk'); // 输出颜色
// const ora = require('ora'); // 进度条 使用3.4.0 过高版本 报错需要使用import
// const osenv = require('osenv'); // 获取不同系统的环境和目录配置
// const shelljs = require('shelljs'); // Node.js执行shell命令
// const { promisify } = require('util'); // 把异步任务转为同步任务 promise
// let downloadGitRepo = require('download-git-repo'); // 下载git项目
// let ncp = require('ncp'); // 异步递归文件和目录复制
// const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
// const consolidate = require('consolidate'); // 统一所有的模板引擎
// const ejs = require('ejs'); // 模板引擎
const commander = require('commander'); // 解析用户传参
const { mapActions, mapActionsKeys, config } = require('./constants');

mapActionsKeys.forEach((key) => {
  commander
    .command(key)
    .alias(mapActions[key].alias)
    .description(mapActions[key].description)
    .action(() => {
      if (key === '*') {
        mapActions[key].action();
        config();
      } else {
        mapActions[key].action(key);
      }
    });
});

commander.on('--help', () => {
  console.log(); console.log(); console.log();
  config();
});

commander.parse(process.argv);
