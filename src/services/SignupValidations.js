import Validations from './Validations';

export default class SignupValidations {
  constructor(name, email, password, rePassword) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.rePassword = rePassword;
  }

  checkValidations() {
    let errors = [];

    //name validations
    if (!Validations.minLength(this.name, 3)) {
      errors['name'] = 'at least 3 characters';
    }

    //email validations
    if (!Validations.checkEmail(this.email)) {
      errors['email'] = 'Invalid Email';
    }

    //password Validations
    if (!Validations.minLength(this.password, 1)) {
      errors['password'] = 'at least 6 characters';
    }

    //rePassword Validations
    if (!Validations.checkRePass(this.password, this.rePassword)) {
      errors['rePassword'] = 'passwords do not match';
    }

    return errors;
  }

  static getErrorMessageFromCode(errorCode) {
    switch (errorCode) {
      case 'EMAIL_EXISTS':
        return 'Email already exists';
      case 'EMAIL_NOT_FOUND':
        return 'Email Not Found';
      case 'INVALID_PASSWORD':
        return 'Invalid Password';
      default:
        return 'Unexpected error occurred. Please try again';
    }
  }
}
