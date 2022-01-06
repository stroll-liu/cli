const spawn = require('cross-spawn');

const install = async (options) => {
  const { cwd, command } = options;
  return new Promise((resolve, reject) => {
    const args = ['install'];
    const child = spawn.sync(command, args, {
      cwd,
      stdio: ['pipe', process.stdout, process.stderr],
    });

    child.once('close', (code) => {
      if (code !== 0) {
        reject(new Error({ command: `${command} ${args.join(' ')}` }));
      } else {
        resolve();
      }
    });
    child.once('error', reject);
  });
};

module.exports = install;
