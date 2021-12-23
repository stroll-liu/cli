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

const { suggestCommands } = require('./config/method');

program.version(version);

program
  .command('create <projectName> [envs...]')
  .alias('C')
  .description('Create project (创建工程)')
  .option('-t, --type <projectType>', 'project type: main | minor (工程类型: 主要 | 次要)')
  .option('-l, --local', 'Pull locally cached templates (拉取本地缓存模板)')
  .option('-m, --merge', 'Merge template (合并模板)')
  .option('-n, --packageManager <command>', 'Use the specified npm client when installing dependencies (在安装依赖时使用指定的 npm 客户端)')
  .option('-r, --registry <url>', 'Use the specified npm registry when installing dependencies (在安装依赖时使用指定的 npm 客户端)')
  .option('-g, --git [message]', 'Mandatory / skip git initialization, and optionally specify the initialization submission information (强制 / 跳过 git 初始化，并可选的指定初始化提交信息)')
  .option('-n, --no-git', 'Skip git initialization (跳过 git 初始化)')
  .option('-f, --force', 'Overwrite the possible configuration of the target directory (覆写目标目录可能存在的配置)')
  .option('-c, --clone', 'Use git clone to get remote preset options (使用 git clone 获取远程预设选项)')
  .option('-x, --proxy', 'Create a project using the specified agent (使用指定的代理创建项目)')
  .option('-b, --bare', 'Omit the novice guidance information in the default components when creating the project (创建项目时省略默认组件中的新手指导信息)')
  .option('-p, --preset <presetName> ', 'Ignore the prompt and use the saved or remote preset options (忽略提示符并使用已保存的或远程的预设选项)')
  .option('-d, --default', 'Ignore the prompt and use the default preset options (忽略提示符并使用默认预设选项)')
  .option('-i, --inlinePreset <json>', 'Ignore the prompt and use the inline JSON string preset options (忽略提示符并使用内联的 JSON 字符串预设选项)')
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

program.arguments('<command>')
  .action((cmd) => {
    suggestCommands(cmd, program.commands);
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
