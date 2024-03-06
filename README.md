# CRM - Version 0.1

Ce CRM (Customer Relationship Management) est une application de gestion des relations avec les clients en version 0.1. Il offre les fonctionnalités suivantes : orders, products, users, supplier et mailer.

## Versions de Node.js et npm
- Node.js : 18.18.0
- npm : 9.8.1

## Fonctionnement avec Docker

Pour utiliser l'application avec Docker, veuillez exécuter les commandes suivantes dans l'ordre :

```bash

# Construire l'image Docker pour MongoDB
$ npm run docker:build:mongo

# Construire l'image Docker pour MailHog (pour la gestion des e-mails)
$ npm run docker:build:mailhog

# Construire l'image Docker pour l'API
$ npm run docker:build:api

# Exécuter l'environnement Docker 
$ npm run docker:run:env

```

## Exécution des tests

Vous pouvez exécuter différents types de tests en utilisant les commandes suivantes :

```bash

# Test unitaire
$ npm run test:unitaire

# Test end-to-end
$ npm run test:e2e

# Test BDD (Behavior-Driven Development) avec Cucumber, comprenant actuellement 20 scénarios
$ npm run test:cucumber

```
