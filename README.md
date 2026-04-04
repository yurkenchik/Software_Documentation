<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Layered NestJS app: sites (domain + REST + Handlebars list), statement import from CSV (Kafka/console), MongoDB persistence.

## API

REST uses global prefix **`api`**. Server listens on `http://localhost:<PORT>` (see `PORT` in `.env`, default in code may vary). Routes **`GET /`** and **`GET /sites`** are registered **outside** the `api` prefix (HTML via Handlebars).

- **Pages (HTML):**
  - `GET /` – home (Handlebars)
  - `GET /sites` – list sites as HTML (data from `SiteService`)
- **Sites (JSON):**
  - `POST /api/sites` – create site (201 + body)
  - `GET /api/sites` – list sites
  - `GET /api/sites/:id` – get site by id
  - `PATCH /api/sites/:id` – update site (full body, same shape as create)
  - `DELETE /api/sites/:id` – delete site (204)
- **Statement import:**
  - `POST /api/import/csv` – import statements from CSV
  - `POST /api/import/csv/stream` – stream CSV rows

## Laboratory work 3 (ЛР3) — where the code lives

MVC-style slice for the **sites** entity (методичка: контролер → бізнес-логіка → представлення HTML):

| ЛР3 пункт | У проєкті |
|-----------|-----------|
| Контролери (HTTP) | `src/presentation/http/site.controller.ts` — `SiteController` (`/api/sites`, JSON), `SiteHtmlController` (`GET /sites` → `@Render('sites/index')`) |
| Бізнес-логіка / вичитка для сторінки й API | `src/application/site/site.service.ts` (`listSites` тощо) |
| Доменна модель і правила | `src/domain/site/entities/site-domain.entity.ts`, `site-entity.props.ts`, винятки в `src/domain/site/exceptions/` |
| Доступ до даних | `src/infrastructure/persistence/mongodb/repositories/mongo-site.repository.ts`, схема `schemas/site-mongo.schema.ts` |
| HTML (представлення) | `src/presentation/http/views/sites/index.hbs`, головна `views/home.hbs`, парціали в `views/partials/` |
| Підключення HBS і виняток `/sites` з префікса `api` | `src/main.ts` |
| Модулі | `src/domain/site/site.module.ts` — обидва контролери, експорт `SiteService` |

Повний ЛР3 ще вимагає **HTML-форм для додавання / редагування / видалення** (п.4 методички); зараз реалізовано **список** і повний **JSON CRUD** під `/api/sites`.

Якщо після помилкового `git reset --hard` гілка знову «старіша» за ці зміни, відновіть останній коміт з роботою: **`git reset --hard bbbae1b`** (або відповідний хеш з `git reflog`).

## Suggested commit history (Axiomera-style)

Messages follow **axiomera-server** (past tense, short sentences; no `feat:` / `fix:`).  
Below you can **copy each block** from `git add` through `git commit` and run in order (e.g. on a fresh branch after `git rm -r --cached .` and `git clean` of tracked files, or when splitting an initial import).

> **Note:** Commits **1–6** do not include `src/main.ts` or `src/app.module.ts`. The app is in a runnable state after **commit 7**. If you need `yarn start` after an earlier step, add those two files to that step’s `git add` list (or squash 1 and 7).

```bash
git add \
  tsconfig.json \
  tsconfig.build.json \
  package.json \
  yarn.lock \
  nest-cli.json \
  test/jest-e2e.json \
  src/shared \
  src/core/exceptions/domain.exception.ts
git commit -m "Migrated Nest starter to layered layout with path aliases and dependencies"
```

```bash
git add src/core/exceptions/exception-codes.ts \
  src/domain/content \
  src/domain/statement-import \
  src/domain/site/site.tokens.ts \
  src/domain/site/site-entity.props.ts \
  src/domain/site/entities \
  src/domain/site/repositories \
  src/domain/site/exceptions
git commit -m "Added domain models for content, statement import, and site aggregate"
```

```bash
git add \
  src/infrastructure/persistence/mongodb \
  src/infrastructure/persistence/kafka \
  src/infrastructure/output \
  src/infrastructure/files
git commit -m "Added Mongoose repositories and Kafka or console output adapters"
```

```bash
git add src/application/statement-import src/presentation/http/import.controller.ts
git commit -m "Implemented statement import module with CSV use cases and HTTP controller"
```

```bash
git add src/application/content
git commit -m "Added create post with media use case and request DTO"
```

```bash
git add \
  src/application/site \
  src/presentation/http/site.controller.ts \
  src/presentation/filters/domain-exception.filter.ts \
  src/domain/site/site.module.ts
git commit -m "Wired SiteModule with SiteService, REST controller, and domain exception mapping"
```

```bash
git add \
  src/app.module.ts \
  src/main.ts \
  src/types/hbs.d.ts \
  src/presentation/http/views
git commit -m "Registered app bootstrap, Handlebars views, and HTML site list outside api prefix"
```

```bash
git add src/tools
git commit -m "Added CLI tools to generate and stream sample CSV data"
```

```bash
git add src/__tests__
git commit -m "Added unit tests for import and create post use cases"
```

```bash
git add README.md
git commit -m "Documented HTTP endpoints and example commit sequence in README"
```

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
