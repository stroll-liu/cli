const ora = require('ora'); // 加载效果
let downloadGitRepo = require('download-git-repo'); // 下载git项目
const { promisify } = require('util'); // 把异步任务转为同步任务 promise

let ncp = require('ncp'); // 异步递归文件和目录复制

downloadGitRepo = promisify(downloadGitRepo);
ncp = promisify(ncp);

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
  waitLoadingStart,
  downloadGitRepo,
  ncp,
};
