import config from '../configs/config.js';

export default {
  setupIdentityTemplateInfoFromNameAndEmail(name, email, nowDate) {
    name = this.getURIableString(name) + nowDate;
    email = this.getURIableString(email);
    const idInfo = JSON.parse(JSON.stringify(config.identityTemplate));
    const todayDate = nowDate.slice(0, 10);
    idInfo.information.identityDate = todayDate;
    idInfo.information.identityExpression = `DID@${nowDate}`;
    idInfo.information.name = name;
    idInfo.information.email = email;
    idInfo.references.idIssuer.name = name;
    idInfo.references.idIssuer['@href'] =
      idInfo.references.idIssuer['@href'] + name + '/';
    idInfo.references.idIssuerRepresentative.name = name;
    idInfo.references.idIssuerRepresentative['@href'] =
      idInfo.references.idIssuerRepresentative['@href'] + name + '/';
    idInfo.references.idReceiver.name = name;
    idInfo.references.idReceiver['@href'] =
      idInfo.references.idReceiver['@href'] + name + '/';

    return idInfo;
  },
  setupCertificateTemplateInfoFromPayload(payload, nowDate) {
    Object.keys(payload).forEach(
      (k) => (payload[k] = this.getURIableString(payload[k]))
    );
    const certInfo = JSON.parse(JSON.stringify(config.certificateTemplate));
    const todayDate = nowDate.slice(0, 10);
    certInfo.information.certificateDate = todayDate;
    certInfo.information.certificateExpression = `en@${nowDate}`;
    certInfo.information.certificateType = payload.certificateType;
    certInfo.information.certifiedEntityType = payload.certifiedEntityType;
    certInfo.references.certIssuerRepresentative.name =
      payload.certIssuerRepresentativeName;
    certInfo.references.certIssuerRepresentative['@href'] =
      certInfo.references.certIssuerRepresentative['@href'] +
      payload.certIssuerRepresentativeName +
      '/';
    certInfo.references.certReceiver.name = payload.certReceiverName;
    certInfo.references.certReceiver['@href'] =
      certInfo.references.certReceiver['@href'] +
      payload.certReceiverName +
      '/';
    certInfo.references.certEntity = {
      ...certInfo.references.certEntity,
      name: payload.name,
      documentHashDigest: payload.documentDigest,
      '@href': payload.uri,
    };

    return certInfo;
  },
  getURIableString(fromString) {
    return fromString
      .split(' ')
      .join('')
      .trim();
  },
};
