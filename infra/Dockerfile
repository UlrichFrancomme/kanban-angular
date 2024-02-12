## Stage development environment
FROM node:20-bookworm-slim AS base

ENV HOST localhost
ENV PORT 4300
ENV NODE_ENV development

RUN npm i -g @angular/cli

WORKDIR /home/node/app
RUN chown -R node:node /home/node/app
USER node

COPY --chown=node:node ./package.json ./package-lock.json ./
RUN npm i

COPY --chown=node:node . /home/node/app/

EXPOSE $PORT

## Stage: Production build
FROM base as production-build
ENV NODE_ENV production
RUN ng build --configuration production

## Stage: Production
FROM nginx:latest as production
COPY --from=production-build /home/node/app/dist/ng-kanban/ /usr/share/nginx/html
COPY infra/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

