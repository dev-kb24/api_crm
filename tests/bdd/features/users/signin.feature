Feature: Connexion d'un utilisateur

  Scenario Outline: Connecter un utilisateur
    Given Je remplis le formulaire de connexion : '<email>' et '<password>'
    When Je soumets le formulaire avec l'url : 'http://localhost:3000/users/signin'
    Then Je devrais recevoir un statu <status> et eventuellement des messages d'erreurs '<messages>'

  Examples:
  | email        | password | status |            messages                                                              |
  |admin@admin.fr| Admin@123    |   200  |                                                                                  |
  | test@test.fr |          |   400  | password should not be empty                                                     |
  |              |          |   400  | email should not be empty,email must be an email,password should not be empty    |
  |    test      |   test   |   400  | email must be an email                                                           |
  |    test@      |   test   |   400  | email must be an email                                                           |
  |    test@test      |   test   |   400  | email must be an email                                                           |
  |test2@test.fr |  test    |   404  | User not found                                                                   |
  |admin@admin.fr|  Admin@456  |   401  | Le mot de passe est incorrect                                                    |
