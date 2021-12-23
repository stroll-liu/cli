/* eslint-disable global-require */
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
const { render } = require('consolidate').ejs; // 统一所有的模板引擎

const { waitLoadingStart, ncp } = require('../config/method');

module.exports = async function (result, cmdObj) {
  const { current, packageName } = cmdObj;
  const destination = current ? process.cwd() : path.resolve(packageName);
  if (fs.existsSync(path.join(result, 'ask.js'))) {
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
          await waitLoadingStart(async () => {
            Object.keys(files).forEach(async (key) => {
              if (key.includes('.js') || key.includes('.json')) {
                let content = files[key].contents.toString();
                if (content.includes('<%=')) {
                  content = await render(content, obj);
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
};
