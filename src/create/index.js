// const fs = require('fs');
// const path = require('path');
// const inquirer = require('inquirer'); // 与用户交互
// const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
// const { render } = require('consolidate').ejs; // 统一所有的模板引擎
// // const shelljs = require('shelljs'); // Node.js执行shell命令
const chalk = require('chalk');

// const { waitLoadingStart, ncp } = require('../constants');
// const { getRepoList, getTagList, download } = require('../http');

module.exports = async function (projectName, envs, cmdObj) {
  console.log(projectName, envs, cmdObj);
  const { type } = cmdObj;
  if (type) {
    if (['main', 'minor'].includes(type)) {
      console.log(type);
    } else {
      console.log(chalk.yellow('项目类型参数错误可选类型为(main 或 minor)'));
    }
  } else {
    console.log('--');
  }
};
