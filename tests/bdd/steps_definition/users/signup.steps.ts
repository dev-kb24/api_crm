import { Given } from '@cucumber/cucumber';

Given('Je remplis le formulaire d\'inscription avec : {string},{string},{int},{string},{string},{string}', function (email,password,civility,firstname,lastname,fonction) {
  this.registrationData = { 
    email: email, 
    password: password,
    civility: civility,
    firstname: firstname,
    lastname: lastname,
    fonction:fonction
  };
});
