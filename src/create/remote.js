const chalk = require('chalk');
const inquirer = require('inquirer'); // 与用户交互

const { orgs } = require('../config');
const generate = require('./generate');
const { waitLoadingStart } = require('../config/method');
const {
  getRepoList, getTagList, download,
} = require('../http');

module.exports = async function (envs, cmdObj) {
  const { type } = cmdObj;
  const org = orgs[type].val;
  const repos = await waitLoadingStart(getRepoList, '拉取模板列表', org);

  if (!repos) {
    chalk.yellow('未拉取到模板列表');
    return;
  }
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'Select the created project (选择创建的项目)',
    choices: repos,
  });

  const tags = await waitLoadingStart(getTagList, '拉取版本列表', org, repo);
  if (!tags) {
    chalk.yellow('未拉取到版本列表');
    return;
  }
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'Select project version (选择项目版本)',
    choices: tags,
  });

  const result = await waitLoadingStart(
    download,
    '拉取模板',
    org,
    repo,
    tag,
  );
  if (!result) {
    chalk.yellow('未拉取到拉取模板');
    return;
  }
  await generate(result, cmdObj);
};
