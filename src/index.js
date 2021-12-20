#!/usr/bin/env node
// const program = require('commander'); // 解析用户传参
// const inquirer = require('inquirer'); // 与用户交互
// const figlet = require('figlet'); // LOGO生成器
// const chalk = require('chalk'); // 输出颜色
// const ora = require('ora'); // 进度条 使用3.4.0 过高版本 报错需要使用import
// const osenv = require('osenv'); // 获取不同系统的环境和目录配置
// const shelljs = require('shelljs'); // Node.js执行shell命令
// const { promisify } = require('util'); // 把异步任务转为同步任务 promise
// let downloadGitRepo = require('download-git-repo'); // 下载git项目
// let ncp = require('ncp'); // 异步递归文件和目录复制
// const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
// const consolidate = require('consolidate'); // 统一所有的模板引擎
// const ejs = require('ejs'); // 模板引擎
const program = require('commander');
const { version } = require('../package.json');
const Create = require('./create');
const Theme = require('./theme');
const Serve = require('./serve');
const Build = require('./build');
const Inspect = require('./inspect');
const { E2E, Unit } = require('./test');
const Lint = require('./lint');

program.version(version);

program
  .command('create <projectName> [envs...]')
  .alias('C')
  .description('Create project (创建工程)')
  .option('-t, --type <projectType>', 'project type: main | minor (工程类型: 主要 | 次要)')
  .option('-l, --local', 'Pull locally cached templates (拉取本地缓存模板)')
  .option('-m, --local', 'Pull locally cached templates (拉取本地缓存模板)')
  .option('-f, --force', 'Pull locally cached templates (拉取本地缓存模板)')
  .action((projectName, envs, cmdObj) => {
    Create(projectName, envs, cmdObj);
  });

program
  .command('theme [fileName] [envs...]')
  .alias('T')
  .description('Create project theme (创建项目主题)')
  .option('-i, --init [filePath]', 'Variable file generation path (变量文件生成路径)')
  .option('-w, --watch', 'Hot update (热更新)')
  .option('-o, --out [outPath]', 'File output directory (文件输出目录)')
  .option('-m, --minimize', 'Compressed file (压缩文件)')
  .option('-c, --config [filePath]', 'Variable file used (使用的变量文件)')
  .action((fileName, envs, cmdObj) => {
    Theme(fileName, envs, cmdObj);
  });

program
  .command('serve')
  .alias('S')
  .description('Start the development server (启动开发服务器)')
  .action((fileName, envs, cmdObj) => {
    Serve(fileName, envs, cmdObj);
  });

program
  .command('build')
  .alias('B')
  .description('Build for production (为生产构建)')
  .action((fileName, envs, cmdObj) => {
    Build(fileName, envs, cmdObj);
  });

program
  .command('inspect')
  .alias('I')
  .description('Check internal webpack configuration (检查内部 webpack 配置)')
  .action((fileName, envs, cmdObj) => {
    Inspect(fileName, envs, cmdObj);
  });

program
  .command('e2e')
  .alias('E')
  .description('Run e2e tests with Cypress (使用 Cypress 运行 e2e 测试)')
  .action((fileName, envs, cmdObj) => {
    E2E(fileName, envs, cmdObj);
  });

program
  .command('lint')
  .alias('L')
  .description('lint and repair source files (lint 和修复源文件)')
  .action((fileName, envs, cmdObj) => {
    Lint(fileName, envs, cmdObj);
  });

program
  .command('unit')
  .alias('U')
  .description('Run unit tests with mochapack (使用 mochapack 运行单元测试)')
  .action((fileName, envs, cmdObj) => {
    Unit(fileName, envs, cmdObj);
  });

// 自定义监听命令
program.on('command:item', (cmdObj) => {
  const [cmd, envs, command] = cmdObj;
  console.log(cmd, envs, command);
});

// 自定义监听已经注册的 option 选项
program.on('option:type', (type) => {
  console.log('option:type', type);
});

// 匹配空执行
if (!process.argv.length) {
  // program.help();
}

program.parse(process.argv);
