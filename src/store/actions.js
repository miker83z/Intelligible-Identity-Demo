import { IntelligibleIdentity } from '@intelligiblesuite/identity';
import config from '../configs/config.js';
import detectEthereumProvider from '@metamask/detect-provider';
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayFromString = require('uint8arrays/from-string');
const uint8ArrayToString = require('uint8arrays/to-string');

export default {
  async checkWeb3Provider({ commit, dispatch }) {
    const provider = await detectEthereumProvider();

    if (provider) {
      commit('SET_WEB3_PROVIDER', { provider });
      await dispatch('enableWeb3Provider');
      dispatch('checkWeb3Connected');
      dispatch('checkNetworkId');
    } else {
      commit('SET_WEB3_PROVIDER', { provider: '' });
    }
  },

  async enableWeb3Provider({ state, commit }) {
    const p = state.web3Provider;
    if (!p) {
      commit('SET_NETWORK_VERSION', { netVer: '' });
      throw new Error('No web3 provider (Metamask) available!');
    }
    try {
      const acc = await p.request({ method: 'eth_requestAccounts' });
      commit('SET_WEB3_REQ_ACCOUNT', { acc });
    } catch (error) {
      commit('SET_WEB3_REQ_ACCOUNT', { acc: '' });
    }
  },

  async checkNetworkId({ state, commit }) {
    const p = state.web3Provider;
    if (!p) {
      commit('SET_NETWORK_VERSION', { netVer: '' });
      throw new Error('No web3 provider (Metamask) available!');
    }
    try {
      const netVer = await p.request({ method: 'net_version' });
      commit('SET_NETWORK_VERSION', { netVer });
    } catch (error) {
      commit('SET_NETWORK_VERSION', { netVer: '' });
    }
  },

  checkWeb3Connected({ state, commit }) {
    const p = state.web3Provider;
    if (!p) {
      commit('SET_WEB3_CONNECTED', { connected: false });
      throw new Error('No web3 provider (Metamask) available!');
    }
    try {
      const connected = p.isConnected();
      commit('SET_WEB3_CONNECTED', { connected });
    } catch (error) {
      commit('SET_WEB3_CONNECTED', { connected: false });
    }
  },

  async signup({ dispatch }, payload) {
    return dispatch('simpleNoAlgo', payload);
  },

  async simpleNoAlgo({ commit, dispatch, state }, payload) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }

    const iid = new IntelligibleIdentity();
    try {
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Preparing your Ethereum token...',
      });
      await iid.prepareNewIdentityWeb3(
        p,
        0,
        config.intelligibleIdArtifact,
        networkId
      );
      iid.setPersonalInformation(payload);
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description:
          'Creating your Akoma Ntoso Identity document...\nPlease sign it, if you agree with the information presented',
      });
      await iid.newIdentityAKN();
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Uploading the document to IPFS',
      });
      const fileAdded = await dispatch('publishIPFS', { iid });
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Finalizing your Ethereum token...',
      });
      await iid.finalizeNewIdentityWeb3(fileAdded.cid.toString());
      commit('SET_INTELLIGIBLE_IDENTITY', { iid });
    } catch (error) {
      console.log(error);
    }
  },

  async login({ dispatch }) {
    return dispatch('checkIIDWeb3Token');
  },

  async checkIIDWeb3Token({ commit, dispatch, state }) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }

    const iid = new IntelligibleIdentity();
    try {
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Getting the information from your Ethereum token...',
      });
      const web3URI = await iid.fromWeb3Address(
        p,
        0,
        undefined,
        config.intelligibleIdArtifact,
        networkId
      );
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Getting the Akoma Ntoso Identity document from IPFS...',
      });
      const aknString = await dispatch('retrieveIPFS', { cid: web3URI });
      iid.fromStringAKN(aknString);
      commit('SET_INTELLIGIBLE_IDENTITY', { iid });
    } catch (error) {
      console.log(error);
    }
  },

  logout({ commit }) {
    commit('SET_INTELLIGIBLE_IDENTITY', {
      iid: '',
    });
  },

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
      let listJson = { identities: [], certificates: [] };
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
      let listJson = { identities: [], certificates: [] };
      if (listCid !== undefined) {
        listJson = JSON.parse(await dispatch('retrieveIPFS', { cid: listCid }));
      }
      listJson.identities.forEach((file) => {
        if (!state.identityFiles.some((elem) => elem.id === file.id))
          commit('ADD_IDENTITY_FILE', { file });
      }); //TODO get ipfs object
      listJson.certificates.forEach((file) => {
        if (!state.identityFiles.some((elem) => elem.id === file.id))
          commit('ADD_CERTIFICATE_FILE', { file });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
