const path = require('path');
const { version } = require('../package.json');

const mapActions = {
  version: {
    command: 'version',
    alias: '-v',
    description: '工具版本(tool version)',
    example: [
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
    action: (fileName) => {
      const method = require(path.resolve(__dirname, fileName));
      method(process.argv.slice(3));
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

module.exports = {
  version,
  mapActions,
};
