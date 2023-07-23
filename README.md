<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Lazzzer/structurizer/assets/43219964/1a642ced-2f67-4e0f-805e-7666afbf8bb8">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/Lazzzer/structurizer/assets/43219964/6b947300-1adc-4c0b-a6c2-f398a205e533">
    <img src="https://github.com/Lazzzer/structurizer/assets/43219964/6b947300-1adc-4c0b-a6c2-f398a205e533" alt="Structurizer Logo" width="75%">
  </picture>
</h1>

Ce projet fait partie d'un Travail de Bachelor réalisé à l'[HEIG-VD](https://heig-vd.ch/), dans la filière Informatique et systèmes de communication (ISC) par Lazar Pavicevic et supervisé par le Professeur Marcel Graf.

Le Travail de Bachelor est également composé d'une API accessible sur ce repository :

#### [`📄 LLM-Structurizer`](https://github.com/Lazzzer/llm-structurizer)

Structurizer est une application web de structuration de données issues du langage naturel. 
L'application se repose sur l'API `LLM-Structurizer` qui, à son tour, utilise des LLMs pour structurer les données.

Structurizer propose les fonctionnalités suivantes:
* Upload de documents pour extraction et structuration des données.
* Structuration des données guidée sous forme de pipelines ou automatique.
* Vérification humaine des données structurées avec assistance possible d'un LLM.
* Consultation des données structurées et affichage de statistiques et agrégations sous forme de graphiques.
* *Question Answering* en langage naturel sur les données structurées.

L'application web est au stade de _Proof of Concept_, elle propose la structuration de documents pdf uniquement. Elle se limite également à la catégorisation et l'extraction de données structurées de *factures*, de *tickets de reçu* et de *relevés de carte de crédit*.

## Démo de l'application

https://github.com/Lazzzer/structurizer/assets/43219964/41d7a85d-0f56-48ca-ae98-5d996849a9ad

## Stack

- [Typescript](https://www.typescriptlang.org)
- [React](https://react.dev/learn)
- [Next.js](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs/installation)
- [Shadcn/ui](https://ui.shadcn.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/15/index.html)
- [Prisma](https://www.prisma.io/docs/getting-started)

## Object Storage

L'application stocke ses documents pdf en utilisant le package `@aws-sdk/client-s3`. N'import quel Object Storage compatible S3 devrait fonctionner.

Les Object Storages suivants ont été testés et sont fonctionnels avec l'application:
- [x] [Amazon S3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)
- [x] [Cloudflare R2](https://developers.cloudflare.com/r2/get-started/)


## Prérequis

- [NodeJS](https://nodejs.org/en/download/) >= version 16
- [NPM](https://docs.npmjs.com/getting-started) >= version 8
- [PostgreSQL](https://www.postgresql.org/docs/15/index.html) version 15
- [Docker](https://docs.docker.com/get-started/)
- [Clé d'API OpenAI](https://platform.openai.com/account/api-keys)
- [Clé d'API de LLM-Structurizer](https://github.com/Lazzzer/llm-structurizer)
- Credentials d'un Object Storage compatible S3

## Environnement de développement

### Clonage du repository

```bash
git clone git@github.com:Lazzzer/structurizer.git
```

### Installation des dépendances

```bash
cd structurizer
npm install
```

### Ajout des variables d'environnement

Créer un fichier `.env` à partir du fichier [.env.example](https://github.com/Lazzzer/structurizer/blob/main/.env.example) et mettez-y vos valeurs.

Exemple:

```bash
# Format: postgresql://[POSTGRES_USER]:[POSTGRES_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]?schema=[DB_SCHEMA]&connect_timeout=300
DATABASE_URL=postgresql://postgres:root@localhost:5432/structurizer?schema=public&connect_timeout=300

# Vous pouvez générer un secret ici: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3001

# S3 Credentials et le nom du bucket
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=...
S3_REGION=...
S3_ENDPOINT=...

# L'URL de votre instance LLM-Structurizer
LLM_STRUCTURIZER_URL=http://localhost:3000

# Les clés d'API
X_API_KEY=...
OPENAI_API_KEY=sk-...
```

### Initialisation de la base de données

```bash
npx prisma db push
```

### Lancement du serveur de développement

> **Note**  
> La base de données doit être initialisée et accessible par le serveur.

```bash
npm run dev
```

L'application est accessible sur ce [lien](http://localhost:3001).

## CI

La branche `main` est protégée et les pull requests doivent passer l'action `ci` pour être mergées.

<img width="1134" alt="Screenshot CI pipelines" src="https://github.com/Lazzzer/structurizer/assets/43219964/1cef8d46-7644-4fe6-94de-d0e4a308527e">

La CI est gérée avec une Github Action qui sépare le processus en trois étapes.

D'abord, elle effectue une installation des dépendances et une mise en cache pour les prochains runs.
Ensuite, elle lance le linting, puis finalement elle vérifie, le build. Les erreurs de négligence détectées lors du linting empêcheront le lancement du build, ce dernier étant relativement long.

Ce workflow s'inspire fortement de l'excellent article de Maxime Heckel sur le [sujet](https://blog.maximeheckel.com/posts/building-perfect-github-action-frontend-teams/).

## Environnement de production en local

> **Note**  
> Docker est nécessaire pour cette étape.

L'environnement de production se lance à l'aide de docker compose, dont un template est disponible dans le fichier [docker-compose.example.yml](https://github.com/Lazzzer/structurizer/blob/main/docker-compose.example.yml). Il ne dépend pas de l'installation précédente.

Comme pour le fichier `.env`, il faut créer un fichier `docker-compose.yml`  à partir du template et y mettre les bonnes variables.

Le docker-compose fourni part du principe que vous lancez l'instance de `LLM-Structurizer` avec son propre docker-compose et connecte `structurizer-app` au network `llm-structurizer_network` pour faire les appels à l'API. La variable `LLM_STRUCTURIZER_URL` peut être ajustée pour répondre aux besoins de votre configuration.

### Création des images

```bash
cd structurizer
docker compose build
```

L'image de l'application se trouve dans le fichier [Dockerfile](https://github.com/Lazzzer/structurizer/blob/main/Dockerfile), basée sur Debian 10.

### Lancement des images

```bash
docker compose up
```

Il est préférable que la base de données soit initialisée avant de lancer l'image du serveur. Dans ce cas, vous pouvez lancer les commandes suivantes:

```bash
# Lancement de la base de données [en background s'il le faut]
docker compose up db [-d]

# Lancement de l'application
docker compose up app [-d]
```

### Lancement des migrations

Le serveur de l'application web est initialisé, si ce dernier ne tourne pas en fond, ouvrez une nouvelle instance de votre terminal et lancez la commande suivante:

```bash
docker exec -it structurizer-app npx prisma migrate deploy
```
La base de données reste accessible localement avec les valeurs présentes dans `DATABASE_URL` sauf celle du port qui forwardée sur `5433` pour éviter tout conflit avec la base de données de `LLM-Structurizer`.

L'application est maintenant disponible sur le même [lien](http://localhost:3001) que précédemment.

### Arrêt des containers

```bash
docker compose down
```

## Considérations pour la mise en production

Le [Dockerfile](https://github.com/Lazzzer/structurizer/blob/main/Dockerfile) avec ses variables d'environnement suffit pour avoir une API fonctionnelle.
L'image n'est actuellement pas dans un container registry.

Lors du premier déploiement, il faut s'assurer que la base de données associée ait bien reçu les migrations avec `npx prisma migrate deploy`. La commande peut se lancer depuis un container actif du serveur de l'application. Il est également possible de lancer la commande localement depuis la racine du projet, après avoir modifié la variable d'environnement `DATABASE_URL` avec la _connection string_ de la base de données de production.

Le déploiement du projet a été testé sur [App Platform](https://www.digitalocean.com/products/app-platform) de Digital Ocean.

## Inspirations & citations

Ce projet s'inspire fortement de l'ingéniosité des travaux suivants :
* [nextjs-postgres-auth-starter](https://github.com/vercel/nextjs-postgres-auth-starter) : Ce repository a permis une mise en place rapide de Next.js 13 avec un template pour [NextAuth.js](https://next-auth.js.org/getting-started/introduction) et [Prisma](https://www.prisma.io/docs/getting-started).
* [shadcn/taxonomy](https://github.com/shadcn/taxonomy) : Cet excellent projet met en avant les nouvelles fonctionnalités de Next.js 13 version *App Router* et de la librairie de composants React [shadcn/ui](https://ui.shadcn.com/docs).
* [Build UI recipes](https://buildui.com/recipes) : Il s'agit d'une collection de code snippets par [Sam Selikoff](https://github.com/samselikoff) pour des interfaces utilisateurs modernes et intuitives. Structurizer contient notamment du code inspiré du [Multistep Wizard](https://buildui.com/recipes/multistep-wizard) et de l'[Artificial Delay](https://buildui.com/recipes/artificial-delay).
* [Animated Gradient Border CSS](https://codepen.io/shantanu-jana/pen/XWVBJRv) : Un code snippet par Shantanu Jana modifié pour le glowing effect présent un peu partout dans l'application.

