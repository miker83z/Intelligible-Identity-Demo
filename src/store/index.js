import { createStore } from 'vuex';
import actions from './actions';

export default createStore({
  state: {
    showLoading: false,
    loadingDescription: '',
    web3Provider: '',
    networkVersion: '',
    intelligibleIdentity: '',
    ipfs: '',
    identityFiles: [],
    cartificateFiles: [],
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
    SET_INTELLIGIBLE_IDENTITY(state, payload) {
      state.intelligibleIdentity = payload.iid;
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
  },
  actions,
});
