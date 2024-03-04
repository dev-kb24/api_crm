Feature: Inscription

  Scenario: Valide
    Given Je remplis le formulaire d'inscription avec une adresse e-mail valide et un mot de passe valide
    When Je soumets le formulaire
    Then Je devrais recevoir une réponse 201 OK avec un message de succès

  Scenario: Invalide
    Given Je remplis le formulaire d'inscription avec des informations invalides
    When Je soumets le formulaire
    Then Je devrais recevoir une réponse avec un code d'erreur et un message d'erreur
