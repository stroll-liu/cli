module.exports = {
  orgs: {
    main: {
      val: 'main-items',
    },
    minor: {
      val: 'minor-items',
    },
    basic: {
      val: 'basic-items',
    },
  },
  stdout: [],
  downloadDirectory: `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`,
};
