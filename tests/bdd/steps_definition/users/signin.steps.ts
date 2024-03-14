import { Given } from '@cucumber/cucumber';

Given(
  'Je remplis le formulaire de connexion : {string} et {string}',
  function (email, password) {
    this.registrationData = {
      email: email,
      password: password,
    };
  },
);
