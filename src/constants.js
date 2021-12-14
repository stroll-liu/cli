const path = require('path');
const ora = require('ora'); // 加载效果
let downloadGitRepo = require('download-git-repo'); // 下载git项目
const { promisify } = require('util'); // 把异步任务转为同步任务 promise

let ncp = require('ncp'); // 异步递归文件和目录复制

downloadGitRepo = promisify(downloadGitRepo);
ncp = promisify(ncp);
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;
const { version } = require('../package.json');

const mapActions = {
  version: {
    command: 'version',
    alias: '-v',
    description: '工具版本(tool version)',
    example: [
      'stroll version', 'stroll -v',
    ],
    choices: [
      'stroll version', 'stroll -v',
    ],
    action: () => {
      console.log(version);
    },
  },
  create: {
    command: 'create',
    alias: '-c',
    description: '创建项目(create project)',
    example: [
      'stroll create <project-name>', 'stroll -c <project-name>',
    ],
    choices: [
      'stroll create <project-name>', 'stroll -c <project-name>',
    ],
    action: (fileName) => {
      const method = require(path.resolve(__dirname, fileName));
      method(...process.argv.slice(3));
    },
  },
  '*': {
    command: '',
    alias: '',
    description: 'command not found',
    example: [],
    action: () => {
      console.log('command not found');
    },
  },
};

const mapActionsKeys = Object.keys(mapActions);

function config() {
  mapActionsKeys.forEach((key) => {
    mapActions[key].example.forEach((example) => {
      console.log(example);
    });
  });
}

const waitLoadingStart = async (fn, mgs, ...args) => {
  const spinner = ora(`${mgs} ...` || '加载中 ...');
  spinner.start();
  const data = await fn(...args)
    .then((res) => {
      spinner.succeed();
      return res;
    })
    .catch((err) => {
      spinner.fail(`${mgs}失败： ${err || ''}`);
      return false;
    });
  return data;
};

module.exports = {
  version,
  downloadDirectory,
  mapActions,
  mapActionsKeys,
  config,
  waitLoadingStart,
  downloadGitRepo,
  ncp,
};
