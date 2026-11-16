FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --package-lock-only --ignore-scripts && npm ci

FROM deps AS test
COPY api ./api
COPY shared ./shared
CMD ["npm", "test"]

FROM deps AS build
COPY web ./web
COPY shared ./shared
RUN npm run build

FROM node:22-alpine AS api
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node api ./api
COPY --chown=node:node shared ./shared
RUN mkdir -p /app/secrets /app/logs && chown node:node /app/secrets /app/logs
USER node
EXPOSE 3000
CMD ["node", "api/src/server.js"]

FROM nginx:1.30.5-alpine AS web
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/web/dist /usr/share/nginx/html
RUN mkdir -p /var/log/erp
EXPOSE 80
