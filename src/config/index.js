module.exports = {
  orgs: {
    main: {
      val: 'main-items',
    },
    minor: {
      val: 'minor-items',
    },
  },
  downloadDirectory: `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`,
};
