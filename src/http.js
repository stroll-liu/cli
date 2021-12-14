const axios = require('axios');

const { downloadDirectory, downloadGitRepo } = require('./constants');

axios.interceptors.response.use((res) => res.data);

function getRepoList() {
  return axios.get('https://api.github.com/orgs/stroll-liu/repos').then((res) => res.map((item) => item.name));
}

function getTagList(project) {
  return axios.get(`https://api.github.com/repos/stroll-liu/${project}/tags`).then((res) => res.map((item) => item.name));
}

const download = async (repo, tag) => {
  let api = `stroll-liu/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
};

module.exports = {
  getRepoList,
  getTagList,
  download,
};
