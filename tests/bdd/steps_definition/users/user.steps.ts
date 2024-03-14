import { When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import { expect } from 'expect';

When("Je soumets le formulaire avec l'url : {string}", async function (url) {
  try {
    this.response = await axios.post(url, this.registrationData);
  } catch (error) {
    this.error = error.response;
  }
});

Then(
  "Je devrais recevoir un statu {int} et eventuellement des messages d'erreurs {string}",
  function (status, messages) {
    if (this.response) {
      expect(this.response.status).toBe(status);
    } else {
      const listMessages = messages.split(',');
      expect(this.error.status).toBe(status);
      expect(
        listMessages.every((message: string) =>
          this.error.data.message.includes(message),
        ),
      ).toBeTruthy();
      expect(this.error.data.error).toBeTruthy();
    }
  },
);
