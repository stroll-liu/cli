const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer'); // 与用户交互
const metalsmith = require('metalsmith'); // 便利文件夹 查看需不需要渲染
const { render } = require('consolidate').ejs; // 统一所有的模板引擎
// const ejs = require('ejs'); // 模板引擎
const shelljs = require('shelljs'); // Node.js执行shell命令

const { waitLoadingStart, ncp } = require('./constants');
const { getRepoList, getTagList, download } = require('./http');

module.exports = async function (projectName) {
  const repos = await waitLoadingStart(getRepoList, '拉取模板列表 ...');
  if (!repos) return;
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: '选择创建的项目(Select the created project)',
    choices: repos,
  });

  const tags = await waitLoadingStart(getTagList, '拉取版本列表 ...', repo);
  if (!tags) return;
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: '选择项目版本(Select project version)',
    choices: tags,
  });

  const result = await waitLoadingStart(download, '拉取模板 ...', repo, tag);
  if (!result) return;
  if (fs.existsSync(path.join(result, 'ask.js'))) {
    await new Promise((res, rej) => {
      metalsmith(__dirname)
        .source(result)
        .destination(path.resolve(projectName || 'abc'))
        .use(async (files, metal, done) => {
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
    await waitLoadingStart(ncp, '创建模板 ...', result, path.resolve(projectName || 'abc'));
  }
};
