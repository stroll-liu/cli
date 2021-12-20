// const shelljs = require('shelljs'); // Node.js执行shell命令
const chalk = require('chalk');
const Remote = require('./remote');
const Local = require('./local');
const Type = require('./type');

module.exports = async function (projectName, envs, cmdObj) {
  const { type, local } = cmdObj;
  if (type && ['main', 'minor'].includes(type)) {
    if (local) {
      Local(projectName, envs, cmdObj);
    } else {
      Remote(projectName, envs, cmdObj);
    }
  } else {
    if (type && !['main', 'minor'].includes(type)) {
      console.log(chalk.yellow('项目类型参数错误可选类型为(main 或 minor)'));
    }
    if (local) {
      Local(projectName, envs, cmdObj);
      return;
    }
    Type(projectName, envs, cmdObj);
  }
};
