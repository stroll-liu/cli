const axios = require('axios');

const { downloadGitRepo } = require('../config/method');
const { downloadDirectory } = require('../config');

axios.interceptors.response.use((res) => res.data);

function getRepoList(org) {
  return axios.get(`https://api.github.com/orgs/${org}/repos`).then((res) => res.map((item) => item.name));
}

function getTagList(org, project) {
  return axios.get(`https://api.github.com/repos/${org}/${project}/tags`).then((res) => res.map((item) => item.name));
}

const download = async (org, repo, tag) => {
  let api = `${org}/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${org}-${repo}-${tag}`;
  await downloadGitRepo(api, dest);
  return dest;
};

module.exports = {
  getRepoList,
  getTagList,
  download,
};
