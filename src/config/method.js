const ora = require('ora'); // 加载效果
const chalk = require('chalk');
let downloadGitRepo = require('download-git-repo'); // 下载git项目
const { exec } = require('child_process');
const { promisify } = require('util'); // 把异步任务转为同步任务 promise

const { exit } = process;
let ncp = require('ncp'); // 异步递归文件和目录复制

downloadGitRepo = promisify(downloadGitRepo);
ncp = promisify(ncp);

const { stdout, stderr } = require('./index');

const waitLoadingStart = async (fn, mgs, ...args) => {
  const spinner = ora(`${mgs || '加载中'} ...`);
  spinner.start();
  const data = await fn(...args)
    .then((res) => {
      spinner.succeed();
      return res;
    })
    .catch((err) => {
      spinner.fail(chalk.err(`${mgs}失败： ${err || ''}`));
      return false;
    });
  return data;
};

const nodeShell = async (shellArr) => {
  if (!shellArr && !shellArr.length) return;
  shellArr.forEach((item) => {
    const { shell, options, fn } = item;
    // const message = shell.split(' ').length - 1;
    // const spinner = ora(`${message || '拉取中'} ...`);
    console.log(shell);
    exec(shell, options || {}, (e, out, err) => {
      if (err) {
        // spinner.fail(chalk.err(`${message}拉取失败： ${e || ''}`));
        exit(1);
      }
      stdout.push(out);
      stderr.push(err);
      console.log(stdout, stderr);
      // spinner.succeed();
      if (fn) fn(err, out, err);
    });
  });
  if (stdout && stdout.length) {
    stdout.forEach((str) => {
      console.log(str);
    });
  }
  if (stderr && stderr.length) {
    stderr.forEach((str) => {
      console.log(chalk.yellow(str));
    });
  }
};

module.exports = {
  waitLoadingStart,
  downloadGitRepo,
  ncp,
  exec,
  nodeShell,
};
