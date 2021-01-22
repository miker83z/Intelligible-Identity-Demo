import IPFS from 'ipfs-core';

const plugin = {
  install(app, opts = {}) {
    app.config.globalProperties.$ipfs = IPFS.create(opts);
  },
};

export default plugin;
