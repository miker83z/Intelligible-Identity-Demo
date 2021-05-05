import { IntelligibleIdentity } from '@intelligiblesuite/identity';
import utils from '../../utils/utils.js';

export default {
  async signup({ dispatch }, payload) {
    return dispatch('simpleNewIdentity', payload);
  },

  async simpleNewIdentity({ commit, dispatch, state }, payload) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }
    const nowDate = new Date().toISOString();
    const idInfo = utils.setupIdentityTemplateInfoFromNameAndEmail(
      payload.name,
      payload.email,
      nowDate
    );

    const iid = new IntelligibleIdentity();
    try {
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Preparing your Ethereum token...',
      });
      await iid.prepareNewIdentityWeb3(p, 0, undefined, networkId);
      iid.setIdentityInformation(idInfo.information, idInfo.references);
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description:
          'Creating your Metadata Identity document...\nPlease sign it, if you agree with the information presented',
      });
      await iid.newIdentityMeta();
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Uploading the document to IPFS',
      });
      const fileAdded = await dispatch('publishIPFS', { iid });
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Finalizing your Ethereum token...',
      });
      const web3URI = fileAdded.cid.toString();
      commit('SET_WEB3_URI', { web3URI });
      await iid.finalizeNewIdentityWeb3(web3URI);
      commit('SET_INTELLIGIBLE_IDENTITY', { iid });
    } catch (error) {
      console.log(error);
    }
  },

  async login({ dispatch }) {
    return dispatch('checkIIDWeb3Token');
  },

  async checkIIDWeb3Token({ commit, dispatch }) {
    const { web3URI, iid } = await dispatch('getIIDFromWeb3Token');
    console.log('Web3 URI: ' + web3URI);
    commit('SET_WEB3_URI', { web3URI });
    commit('SET_INTELLIGIBLE_IDENTITY', { iid });
  },

  async getIIDFromWeb3Token({ commit, dispatch, state }, payload) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }
    const addressWeb3 = payload !== undefined ? payload.addressWeb3 : undefined;

    const iid = new IntelligibleIdentity();
    commit('LOADING_SPINNER_SHOW_MUTATION', {
      loading: true,
      description: 'Getting the information from your Ethereum token...',
    });
    const web3URI = await iid.fromWeb3Address(p, 0, addressWeb3, networkId);
    commit('LOADING_SPINNER_SHOW_MUTATION', {
      loading: true,
      description: 'Getting the Metadata Identity document from IPFS...',
    });
    const metaString = await dispatch('retrieveIPFS', { cid: web3URI });
    iid.fromStringMeta(metaString);

    return { web3URI, iid };
  },

  logout({ commit }) {
    commit('SET_INTELLIGIBLE_IDENTITY', {
      iid: '',
    });
    commit('SET_WEB3_URI', { web3URI: '' });
  },
};
