const inquirer = require('inquirer'); // 与用户交互

const Local = require('./local');
const Remote = require('./remote');
const { orgs } = require('../config');

module.exports = async function (projectName, envs, cmdObj) {
  const types = Object.keys(orgs);
  const { type, local } = await inquirer.prompt({
    name: 'type',
    type: 'list',
    message: 'Select project type (选择项目类型)',
    choices: types,
  });

  // eslint-disable-next-line no-param-reassign
  cmdObj.type = type;
  if (local) {
    await Local(projectName, envs, cmdObj);
  } else {
    await Remote(projectName, envs, cmdObj);
  }
};
