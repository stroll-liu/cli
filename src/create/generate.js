/* eslint-disable global-require */
const { existsSync, rmSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
const { render } = require('consolidate').ejs; // 统一所有的模板引擎

const { waitLoadingStart, ncp } = require('../config/method');
// const install = require('./install');

module.exports = async function (result, cmdObj) {
  const {
    destination, force, current,
  } = cmdObj;
  if (!force) {
    if (current) {
      const { isForce } = await inquirer.prompt({
        name: 'file',
        type: 'list',
        message: 'Whether to overwrite the directory (是否覆盖目录)',
        choices: [{ name: 'yes (是)', value: true }, { name: 'no (否)', value: false }],
      });
      if (isForce) {
        await rmSync(destination, { recursive: true });
      }
    } else if (existsSync(destination)) {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(destination)} already exists (目标目录 ${chalk.cyan(destination)} 已存在).`,
          choices: [
            { name: 'Overwrite (覆盖)', value: 'overwrite' },
            { name: 'Merge (不做处理)', value: 'merge' },
            { name: 'Cancel (取消)', value: false },
          ],
        },
      ]);
      if (!action) return;
      if (action === 'overwrite') await rmSync(destination, { recursive: true });
    }
  } else {
    await rmSync(destination, { recursive: true });
  }
  if (existsSync(path.join(result, 'ask.js'))) {
    await new Promise((res, rej) => {
      metalsmith(__dirname)
        .source(result)
        .destination(destination)
        .use(async (files, metal, done) => {
          // eslint-disable-next-line import/no-dynamic-require
          const args = require(path.join(result, 'ask.js'));
          const obj = await inquirer.prompt(args);
          const meta = metal.metadata();
          Object.assign(meta, obj);
          delete files['ask.js'];
          done();
        })
        .use(async (files, metal, done) => {
          const obj = metal.metadata();
          console.log('modules', obj);
          await waitLoadingStart(async () => {
            Object.keys(files).forEach(async (key) => {
              if (key.includes('.js') || key.includes('.json') || key.includes('.html') || key.includes('.ts') || key.includes('.styl')) {
                let content = files[key].contents.toString();
                if (content.includes('<%=') || content.includes('<%_') || content.includes('<%-')) {
                  content = await render(content, { ...cmdObj, ...obj });
                  files[key].contents = Buffer.from(content);
                }
              }
            });
          }, '渲染模板 ...');
          done();
        })
        .build((err) => {
          if (err) {
            rej(err);
          } else {
            res(true);
          }
        });
    });
  } else {
    await waitLoadingStart(
      ncp,
      '创建模板 ...',
      result,
      destination,
    );
  }
  // await install({
  //   cwd: destination,
  //   command: 'npm',
  // });
};
