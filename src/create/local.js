const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

const generate = require('./generate');
const { downloadDirectory } = require('../config');

module.exports = async function (envs, cmdObj) {
  fs.readdir(downloadDirectory, async (err, files) => {
    if (err) {
      return console.log(chalk.yellow('The local template does not exist (本地模板不存在)'));
    }
    const { file } = await inquirer.prompt({
      name: 'file',
      type: 'list',
      message: 'Select project version (选择项目版本)',
      choices: files,
    });
    const fileAddress = `${downloadDirectory}/${file}`;
    return generate(fileAddress, cmdObj);
  });
};
