import detectEthereumProvider from '@metamask/detect-provider';

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
};
