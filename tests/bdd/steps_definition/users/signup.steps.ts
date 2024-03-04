import { Given,When,Then } from '@cucumber/cucumber';
import axios from 'axios';
import { expect } from 'expect';



let registrationData = {};

Given('Je remplis le formulaire d\'inscription avec une adresse e-mail valide et un mot de passe valide', function () {
  registrationData = { email: 'testuser@example.com', password: 'password123' };
});

Given('Je remplis le formulaire d\'inscription avec des informations invalides', function () {
  registrationData = { email: 'invalidemail', password: 'short' };
});

When('Je soumets le formulaire', async function () {
  try {
    this.response = await axios.post('http://localhost:3000/users/signup', registrationData);
  } catch (error) {
    this.error = error.response;
  }
});

Then('Je devrais recevoir une réponse 201 OK avec un message de succès', function () {
  // Vérifiez que la réponse est réussie (201 created) et qu'elle contient un message de succès
  expect(this.response.status).toBe(201);
});

Then('Je devrais recevoir une réponse avec un code d\'erreur et un message d\'erreur', function () {
  // Vérifiez que la réponse contient un code d'erreur et un message d'erreur
  expect(this.error.status).toBe(400);
  expect(this.error.data.error).toBeTruthy();
});
