import Validations from './Validations';

export default class CertificateValidations {
  constructor(name, uri, documentDigest, addressWeb3) {
    this.name = name;
    this.uri = uri;
    this.documentDigest = documentDigest;
    this.addressWeb3 = addressWeb3;
  }

  checkValidations() {
    let errors = [];

    if (!Validations.minLength(this.name, 3)) {
      errors['name'] = 'at least 3 characters';
    }

    if (!Validations.minLength(this.uri, 3)) {
      errors['uri'] = 'at least 3 characters';
    }

    if (!Validations.minLength(this.documentDigest, 3)) {
      errors['documentDigest'] = 'at least 3 characters';
    }

    if (!Validations.minLength(this.addressWeb3, 3)) {
      errors['addressWeb3'] = 'at least 3 characters';
    }

    return errors;
  }

  static getErrorMessageFromCode(errorCode) {
    return errorCode + '- Please try again';
  }
}
