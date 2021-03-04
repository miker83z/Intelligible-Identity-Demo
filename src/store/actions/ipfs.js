import config from '../../configs/config.js';
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayFromString = require('uint8arrays/from-string');
const uint8ArrayToString = require('uint8arrays/to-string');

export default {
  async initIPFS({ commit }, payload) {
    try {
      const ipfs = await payload.ipfs;
      commit('SET_IPFS', { ipfs });
    } catch (err) {
      console.log(err);
    }
  },

  async publishIPFS({ dispatch, state }, payload) {
    const ipfs = state.ipfs;
    if (!ipfs) {
      throw new Error('No ipfs provider available!');
    }
    try {
      const fileUploaded = await ipfs.add(
        uint8ArrayFromString(payload.iid.akn.finalize())
      );

      const listCid = await dispatch('retrievePublishedListIPFS');
      let listJson = config.listTemplate;
      if (listCid !== undefined) {
        listJson = JSON.parse(await dispatch('retrieveIPFS', { cid: listCid }));
      }

      listJson.identities.push({
        id: fileUploaded.cid.toString(),
        name: payload.iid.information.name,
      });
      const listUploaded = await ipfs.add(
        uint8ArrayFromString(JSON.stringify(listJson))
      );

      const ipns = await ipfs.name.publish(listUploaded.cid);
      console.log(ipns);

      return fileUploaded;
    } catch (err) {
      console.log(err);
    }
  },

  async publishIPFSCertificate({ dispatch, state }, payload) {
    const ipfs = state.ipfs;
    if (!ipfs) {
      throw new Error('No ipfs provider available!');
    }
    try {
      const fileUploaded = await ipfs.add(
        uint8ArrayFromString(payload.ice.akn.finalize())
      );

      const listCid = await dispatch('retrievePublishedListIPFS');
      let listJson = config.listTemplate;
      if (listCid !== undefined) {
        listJson = JSON.parse(await dispatch('retrieveIPFS', { cid: listCid }));
      }

      listJson.certificates.push({
        id: fileUploaded.cid.toString(),
        name: payload.ice.information.name,
        docURI: payload.ice.information.uri,
      });
      const listUploaded = await ipfs.add(
        uint8ArrayFromString(JSON.stringify(listJson))
      );

      const ipns = await ipfs.name.publish(listUploaded.cid);
      console.log(ipns);

      return fileUploaded;
    } catch (err) {
      console.log(err);
    }
  },

  async retrieveIPFS({ state }, payload) {
    const ipfs = state.ipfs;
    if (!ipfs) {
      throw new Error('No ipfs provider available!');
    }
    try {
      const chunks = [];
      for await (const chunk of ipfs.cat(payload.cid)) {
        chunks.push(chunk);
      }
      return uint8ArrayToString(uint8ArrayConcat(chunks));
    } catch (err) {
      console.log(err);
    }
  },

  async retrievePublishedListIPFS({ state }) {
    const ipfs = state.ipfs;
    if (!ipfs) {
      throw new Error('No ipfs provider available!');
    }
    try {
      const published = [];
      for await (const p of ipfs.name.resolve(config.ipfsIPNS)) {
        published.push(p);
      }
      return published[published.length - 1];
    } catch (err) {
      console.log(err);
    }
  },

  async retrieveAllFilesIPFS({ commit, dispatch, state }) {
    const ipfs = state.ipfs;
    if (!ipfs) {
      throw new Error('No ipfs provider available!');
    }
    try {
      const listCid = await dispatch('retrievePublishedListIPFS');
      let listJson = config.listTemplate;
      if (listCid !== undefined) {
        listJson = JSON.parse(await dispatch('retrieveIPFS', { cid: listCid }));
      }
      listJson.identities.forEach((file) => {
        if (!state.identityFiles.some((elem) => elem.id === file.id))
          commit('ADD_IDENTITY_FILE', { file });
      }); //TODO get ipfs object
      listJson.certificates.forEach((file) => {
        if (!state.certificateFiles.some((elem) => elem.id === file.id))
          commit('ADD_CERTIFICATE_FILE', { file });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
