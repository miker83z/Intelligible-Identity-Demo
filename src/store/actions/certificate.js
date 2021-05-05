import { IntelligibleCertificate } from '@intelligiblesuite/certificates';
import utils from '../../utils/utils.js';

export default {
  async submitCertificate({ dispatch }, payload) {
    return dispatch('simpleNewCertificate', payload);
  },

  async simpleNewCertificate({ commit, dispatch, state }, payload) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }
    const iid = state.intelligibleIdentity;
    if (!iid) {
      throw new Error('No Intelligible Identity available!');
    }
    const nowDate = new Date().toISOString();
    //// Receiver
    const receiver = await dispatch('getIIDFromWeb3Token', {
      addressWeb3: payload.addressWeb3,
    });
    payload.certReceiverName = receiver.iid.information.name;
    ////
    payload.certIssuerRepresentativeName = iid.information.name;
    const certInfo = utils.setupCertificateTemplateInfoFromPayload(
      payload,
      nowDate
    );

    const ice = new IntelligibleCertificate();
    try {
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: "Preparing certificate's Ethereum token...",
      });
      await ice.prepareNewCertificateWeb3(p, 0, payload.addressWeb3, networkId);
      ice.setCertificateInformation(certInfo.information, certInfo.references);
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description:
          'Creating your Metadata Identity document...\nPlease sign it, if you agree with the information presented',
      });
      /*const ipfs = state.ipfs;
      if (!ipfs) {
        throw new Error('No ipfs provider available!');
      }
      const fileUploaded = await ipfs.add(
        uint8ArrayFromString(iid.meta.finalize()),
        { onlyHash: true }
      );*/
      ice.newCertificateMeta();
      const signature = await iid.web3.signData(
        ice.meta.finalizeNoConclusions()
      );
      ice.meta.addSignature(
        certInfo.references.certIssuerRepresentative['@eId'],
        certInfo.references.certIssuerRepresentative.name,
        certInfo.references.certIssuerRepresentativeRole['@eId'],
        certInfo.references.certIssuerRepresentativeRole.name,
        certInfo.references.certIssuerRepresentative['@href'], //TODO
        iid.web3.mainAddress,
        Date.now(),
        signature
      );
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Uploading the document to IPFS',
      });

      const fileAdded = await dispatch('publishIPFSCertificate', { ice });
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Finalizing your Ethereum token...',
      });
      await ice.finalizeNewCertificateWeb3(fileAdded.cid.toString());
      //commit('SET_INTELLIGIBLE_IDENTITY', { ice });
    } catch (error) {
      console.log(error);
    }
  },

  async signCertificate({ commit, dispatch, state }, payload) {
    const p = state.web3Provider;
    const networkId = state.networkVersion;
    if (!p || !networkId) {
      throw new Error('No web3 provider (Metamask) available!');
    }
    const iid = state.intelligibleIdentity;
    if (!iid) {
      throw new Error('Intelligible Identity available!');
    }
    try {
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description:
          'Please sign it, if you agree with the information presented',
      });
      if (
        payload.ice.references.certReceiver['@href'] !==
        iid.references.idReceiver['@href']
      )
        throw new Error('Only the receiver can sign!');
      const signature = await iid.web3.signData(
        payload.ice.meta.finalizeNoConclusions()
      );
      payload.ice.meta.addSignature(
        payload.ice.references.certReceiver['@eId'],
        payload.ice.references.certReceiver.name,
        payload.ice.references.certReceiverRole['@eId'],
        payload.ice.references.certReceiverRole.name,
        payload.ice.references.certReceiver['@href'], //TODO
        iid.web3.mainAddress,
        Date.now(),
        signature
      );
      commit('LOADING_SPINNER_SHOW_MUTATION', {
        loading: true,
        description: 'Uploading the document to IPFS',
      });
      const fileAdded = await dispatch('publishIPFSCertificate', {
        ice: payload.ice,
      });

      return fileAdded.cid.toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  },
};
