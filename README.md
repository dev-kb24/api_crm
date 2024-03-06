  <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

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
