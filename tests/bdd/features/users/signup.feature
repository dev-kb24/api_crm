Feature: Inscription d'un utilisateur

  Scenario Outline: Ajouter des utilisateurs
    Given Je remplis le formulaire d'inscription avec : '<email>','<password>',<civility>,'<firstname>','<lastname>','<fonction>'
    When Je soumets le formulaire avec l'url : 'http://localhost:3000/users/signup'
    Then Je devrais recevoir un statu <status> et eventuellement des messages d'erreurs '<messages>'

  Examples:
  | email        | password | civility | firstname | lastname | fonction | status |            messages                                                              |
  | test@test.fr | Test@123 |    1     |   Rémi    |  Dufour  |    dev   |   201  |                                                                                  |
  | test@test.fr |          |    1     |   Rémi    |  Dufour  |    dev   |   400  | password should not be empty                                                     |
  |              |          |    1     |   Rémi    |  Dufour  |    dev   |   400  | email should not be empty,email must be an email,password should not be empty    |                                                          
  | test@test.fr | Test@123 |    1     |   Rémi    |  Dufour  |    dev   |   409  | User already exist                                                               |
  |test1@test.fr | test     |    1     |   Rémi    |  Dufour  |    dev   |   400  | password is not strong enough,password must be longer than or equal to 8 characters  |
  |test1@test.fr | testtest     |    1     |   Rémi    |  Dufour  |    dev   |   400  | password is not strong enough |
  |test1@test.fr | Test@test     |    1     |   Rémi    |  Dufour  |    dev   |   400  | password is not strong enough |
  |test1@test.fr | test@123     |    1     |   Rémi    |  Dufour  |    dev   |   400  | password is not strong enough |
  |test1@test.fr | Tests123     |    1     |   Rémi    |  Dufour  |    dev   |   400  | password is not strong enough |
  |    test      |   test   |    1     |   Rémi    |  Dufour  |    dev   |   400  | email must be an email |
  |    test@      |   test   |    1     |   Rémi    |  Dufour  |    dev   |   400  | email must be an email |
  |    test@test      |   test   |    1     |   Rémi    |  Dufour  |    dev   |   400  | email must be an email |



