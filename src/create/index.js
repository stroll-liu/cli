// const shelljs = require('shelljs'); // Node.js执行shell命令
const path = require('path');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');

const Remote = require('./remote');
const Local = require('./local');
const Type = require('./type');

const { exit } = process;
const { error, warning } = console;

module.exports = async function (projectName, envs, cmdObj) {
  cmdObj.current = projectName === '.';
  const result = validateProjectName(projectName);
  if (cmdObj.current) {
    cmdObj.packageName = path.basename(path.resolve());
  } else {
    cmdObj.packageName = projectName;
  }
  if (!result.validForNewPackages && !cmdObj.current) {
    error(chalk.red(`Invalid project name: "${projectName}"`));
    await exit(1);
  }
  const { type, local } = cmdObj;
  if (type && ['main', 'minor'].includes(type)) {
    if (local) {
      Local(envs, cmdObj);
    } else {
      Remote(envs, cmdObj);
    }
  } else {
    if (type && !['main', 'minor'].includes(type)) {
      warning(chalk.yellow('项目类型参数错误可选类型为(main 或 minor)'));
    }
    if (local) {
      Local(envs, cmdObj);
      return;
    }
    Type(envs, cmdObj);
  }
};
