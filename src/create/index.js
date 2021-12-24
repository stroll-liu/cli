// const shelljs = require('shelljs'); // Node.js执行shell命令
const path = require('path');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');

// const Creator = require('./creator');
const Remote = require('./remote');
const Local = require('./local');
const Type = require('./type');

// const { getPromptModules } = require('../config/method');

const { exit } = process;
const { error, warning } = console;

module.exports = async function (name, envs, cmdObj) {
  cmdObj.current = name === '.';
  const result = validateProjectName(name);
  if (cmdObj.current) {
    cmdObj.packageName = path.basename(path.resolve());
  } else {
    cmdObj.packageName = name;
  }
  if (!result.validForNewPackages && !cmdObj.current) {
    error(chalk.red(`Invalid project name: "${name}"`));
    await exit(1);
  }
  const {
    type, local, current,
  } = cmdObj;
  cmdObj.destination = current ? process.cwd() : path.resolve(name);
  if (type && ['main', 'minor'].includes(type)) {
    if (local) {
      await Local(envs, cmdObj);
    } else {
      await Remote(envs, cmdObj);
    }
  } else {
    if (type && !['main', 'minor'].includes(type)) {
      warning(chalk.yellow('项目类型参数错误可选类型为(main 或 minor)'));
    }
    if (local) {
      await Local(envs, cmdObj);
    } else {
      await Type(envs, cmdObj);
    }
  }

  // const creator = new Creator(cmdObj, getPromptModules());
  // creator.create(cmdObj);
};
