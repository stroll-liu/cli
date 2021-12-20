// eslint-disable-next-line import/no-extraneous-dependencies
const downloadUrl = require('download');
// eslint-disable-next-line import/no-extraneous-dependencies
const gitclone = require('git-clone');
// eslint-disable-next-line import/no-extraneous-dependencies
const rm = require('rimraf').sync;

/**
 * 规范化回购字符串。repo: string
 */
function normalize(repo) {
  console.log(repo);
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);
  if (match) {
    const url = match[2];
    const directCheckout = match[3] || 'master';
    return {
      type: 'direct',
      url,
      checkout: directCheckout,
    };
  }
  regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
  match = regex.exec(repo);
  const type = match[1] || 'github';
  let origin = match[2] || null;
  const owner = match[3];
  const name = match[4];
  const checkout = match[5] || 'master';
  if (origin == null) {
    if (type === 'github') {
      origin = 'github.com';
    } else if (type === 'gitlab') {
      origin = 'gitlab.com';
    } else if (type === 'gitee') {
      origin = 'gitee.com';
    } else if (type === 'bitbucket') {
      origin = 'bitbucket.org';
    }
  }
  return {
    type, origin, owner, name, checkout,
  };
}
/**
 * 在未指定的情况下向 url 添加协议 origin: string, clone: string
 */
function addProtocol(origin, clone) {
  let insideOrigin = origin;
  if (!/^(f|ht)tps?:\/\//i.test(insideOrigin)) {
    if (clone) {
      insideOrigin = `git@${insideOrigin}`;
    } else {
      insideOrigin = `https://${insideOrigin}`;
    }
  }
  return insideOrigin;
}
/**
 * 返回给定 `repo` 的 zip 或 git url。repo: objeck, clone: string
 */
function getUrl(repo, clone) {
  let url;
  // 使用协议获取原点并添加尾部斜杠或冒号（用于 ssh）
  let origin = addProtocol(repo.origin, clone);
  if (/^git@/i.test(origin)) {
    origin += ':';
  } else {
    origin += '/';
  }
  // 建立网址
  if (clone) {
    url = `${origin}${repo.owner}/${repo.name}.git`;
  } else if (repo.type === 'github') {
    url = `${origin}${repo.owner}/${repo.name}/archive/${repo.checkout}.zip`;
  } else if (repo.type === 'gitlab') {
    url = `${origin}${repo.owner}/${repo.name}/repository/archive.zip?ref=${repo.checkout}`;
  } else if (repo.type === 'bitbucket') {
    url = `${origin}${repo.owner}/${repo.name}/get/${repo.checkout}.zip`;
  }
  return url;
}
/**
 * 将 `repo` 下载到 `dest` 并回调 `fn(err), repo: string, dest: string, opts: object, fn: function`
 */
module.exports = function download(repo, dest, opts, fn) {
  let insideFn = fn;
  let insideOpts = opts;
  let insideRepo = repo;
  if (typeof insideOpts === 'function') {
    insideFn = insideOpts;
    insideOpts = null;
  }
  insideOpts = insideOpts || {};
  const clone = insideOpts.clone || false;
  delete insideOpts.clone;
  insideRepo = normalize(insideRepo);
  const url = insideRepo.url || getUrl(insideRepo, clone);
  if (clone) {
    const cloneOptions = {
      checkout: insideRepo.checkout,
      shallow: insideRepo.checkout === 'master',
      ...insideOpts,
    };
    gitclone(url, dest, cloneOptions, (err) => {
      if (err === undefined) {
        rm(`${dest}/.git`);
        insideFn();
      } else {
        insideFn(err);
      }
    });
  } else {
    const downloadOptions = {
      extract: true,
      strip: 1,
      mode: '666',
      ...insideOpts,
      headers: {
        accept: 'application/zip',
        ...(insideOpts.headers || {}),
      },
    };
    downloadUrl(url, dest, downloadOptions)
      .then(() => {
        insideFn();
      })
      .catch((err) => {
        insideFn(err);
      });
  }
};
