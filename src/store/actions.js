import { IntelligibleIdentity } from '@intelligiblesuite/identity';
import intelligibleIdArtifact from '../assets/abi/IntelligibleIdentity.json';
import detectEthereumProvider from '@metamask/detect-provider';
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayFromString = require('uint8arrays/from-string');
const uint8ArrayToString = require('uint8arrays/to-string');

export default {
  async checkWeb3Provider({ commit, dispatch }) {
    const provider = await detectEthereumProvider();

    if (provider) {
      commit('SET_WEB3_PROVIDER', { provider });
      dispatch('checkNetworkId');
    } else {
      commit('SET_WEB3_PROVIDER', { provider: '' });
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
      await iid.prepareNewIdentityWeb3(p, 0, intelligibleIdArtifact, networkId);
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
      const fileAdded = await dispatch('publishIPFS', {
        stringToUpload: iid.akn.finalize(),
      });
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
        intelligibleIdArtifact,
        networkId
      );
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Getting the Akoma Ntoso Identity document from IPFS...',
      });
      const aknString = await dispatch('retrieveIPFS', { cid: web3URI });
      iid.fromAddressAKN(aknString);
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
        uint8ArrayFromString(payload.stringToUpload)
      );

      const listCid = await dispatch('retrievePublishedListIPFS');

      const list = await dispatch('retrieveIPFS', { cid: listCid });

      const listJson = JSON.parse(list); //{ identities: [], certificates: [] };
      listJson.identities.push(fileUploaded.cid.toString());
      const listUploaded = await ipfs.add(
        uint8ArrayFromString(JSON.stringify(listJson))
      );

      await ipfs.name.publish(listUploaded.cid);

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
      for await (const p of ipfs.name.resolve(
        `/ipns/QmTGQqdwyPiFeaZQGdHqVopCLtnMY1hyzG3XFUz6Yqmv65`
      )) {
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
      const list = await dispatch('retrieveIPFS', { cid: listCid });
      const listJson = JSON.parse(list);
      listJson.identities.forEach((file) => {
        if (!state.identityFiles.includes(file))
          commit('ADD_IDENTITY_FILE', { file });
      }); //TODO get ipfs object
      listJson.certificates.forEach((file) => {
        if (!state.identityFiles.includes(file))
          commit('ADD_CERTIFICATE_FILE', { file });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
