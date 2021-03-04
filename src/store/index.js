import { createStore } from 'vuex';
import actions from './actions/';

export default createStore({
  state: {
    showLoading: false,
    loadingDescription: '',
    web3Provider: '',
    networkVersion: '',
    web3RequestAccounts: [],
    web3ProviderOnline: false,
    intelligibleIdentity: '',
    web3URI: '',
    ipfs: '',
    identityFiles: [],
    certificateFiles: [],
  },
  mutations: {
    LOADING_SPINNER_SHOW_MUTATION(state, payload) {
      state.showLoading = payload.loading;
      state.loadingDescription = payload.description;
    },
    SET_WEB3_PROVIDER(state, payload) {
      state.web3Provider = payload.provider;
    },
    SET_NETWORK_VERSION(state, payload) {
      state.networkVersion = payload.netVer;
    },
    SET_WEB3_CONNECTED(state, payload) {
      state.web3ProviderOnline = payload.connected;
    },
    SET_WEB3_REQ_ACCOUNT(state, payload) {
      state.web3RequestAccounts = payload.acc;
    },
    SET_INTELLIGIBLE_IDENTITY(state, payload) {
      state.intelligibleIdentity = payload.iid;
    },
    SET_WEB3_URI(state, payload) {
      state.web3URI = payload.web3URI;
    },
    SET_IPFS(state, payload) {
      state.ipfs = payload.ipfs;
    },
    ADD_IDENTITY_FILE(state, payload) {
      state.identityFiles.push(payload.file);
    },
    ADD_CERTIFICATE_FILE(state, payload) {
      state.certificateFiles.push(payload.file);
    },
  },
  getters: {
    getDescription(state) {
      return state.loadingDescription;
    },
    isAuthenticated(state) {
      return typeof state.intelligibleIdentity === 'object';
    },
    getIntelligibleIdentity(state) {
      return state.intelligibleIdentity;
    },
    getWeb3URI(state) {
      return state.web3URI;
    },
    noProvider(state) {
      return !state.web3Provider;
    },
    notOnlineWeb3(state) {
      return state.web3RequestAccounts.length === 0;
    },
    notEnabled(state) {
      return state.web3Enabled;
    },
    getDocumentInfo(state) {
      return (payload) => {
        if (state.identityFiles !== undefined) {
          const tmp = state.identityFiles.find(
            (elem) => elem['id'] === payload.id
          );
          if (tmp !== undefined) return { ...tmp, type: 'Identity' };
        }
        if (state.certificateFiles !== undefined) {
          const tmp = state.certificateFiles.find(
            (elem) => elem['id'] === payload.id
          );
          if (tmp !== undefined) return { ...tmp, type: 'Certificate' };
        }
        return undefined;
      };
    },
  },
  actions,
});
