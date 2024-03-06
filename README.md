# CRM - Version 0.1

Ce CRM (Customer Relationship Management) est une application de gestion des relations avec les clients en version 0.1. Il offre les fonctionnalités suivantes : orders, products, users, supplier et mailer.

## Versions de Node.js et npm
- Node.js : 20.11.1
- npm : 10.2.4

## Installation

Tout d'abord vous devez cloner le projet : 

```bash

$ git clone https://github.com/dev-kb24/api_crm.git

```

Ensuite vous devez installer les dépendances : 

```bash

$ npm install

```

Puis lancer un test unitaire : 

```bash

$ npm run test:unitaire

```

Pour finir, vous devez créer un fichier .env, en vous servant du fichier exemple : .env.example.

## Lancement du projet en local

Tout d'abord vous devez lancer les deux commandes prisma pour générer et pousser la database dans mongo : 

```bash

$ npm run prisma:generate

$ npm run prisma:push

```

Pour finir :

```bash

$ npm run start:dev

```

Vous pouvez aller sur ce lien : http://localhost:3000/api pour afficher le swagger de l'api.
Vous devez installer un logiciel "mailhog", pour simuler l'envoi d'un mail en local.


## Lancement du projet avec Docker

Pour utiliser l'application avec Docker, veuillez exécuter les commandes suivantes dans l'ordre :

```bash

# Construire l'image Docker pour MongoDB
$ npm run docker:build:mongo

# Construire l'image Docker pour MailHog (pour la gestion des e-mails)
$ npm run docker:build:mailhog

# Construire l'image Docker pour l'API (Version 18.18.0 au lieu de la 20.11.1, soucis au niveau de npm install, il reste bloqué à building...)
$ npm run docker:build:api

# Exécuter l'environnement Docker 
$ npm run docker:run:env

```

Vous pouvez aller sur ce lien : http://localhost:3000/api pour afficher le swagger de l'api.

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
