#!/usr/bin/env node
// const inquire = require('inquire'); // 与用户交互
const commander = require('commander'); // 解析用户传参
const { mapActions } = require('./constants');

const mapActionsKeys = Object.keys(mapActions);

function config() {
  mapActionsKeys.forEach((key) => {
    mapActions[key].example.forEach((example) => {
      console.log(example);
    });
  });
}

mapActionsKeys.forEach((key) => {
  commander
    .command(key)
    .alias(mapActions[key].alias)
    .description(mapActions[key].description)
    .action(() => {
      if (key === '*') {
        mapActions[key].action();
        config();
      } else {
        mapActions[key].action(key);
      }
    });
});

commander.on('--help', () => {
  console.log(); console.log(); console.log();
  config();
});

commander.parse(process.argv);
