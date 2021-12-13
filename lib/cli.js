#!/usr/bin/env node
const meow = require('meow');
const inquire = require('inquire');
const commander = require('commander'); // 解析用户传参

meow(`
  Usage
    $  [input]

  Options
    --foo  Lorem ipsum. [Default: false]\r\n

  Examples
    $ 
    unicorns
    $  rainbows
    unicorns & rainbows
`);

commander.parse(process.argv);
