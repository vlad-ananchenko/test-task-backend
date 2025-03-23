FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "development" ]; \
  then npm install; \
  else npm ci --omit=dev; \
  fi

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; \
  then npm run build; \
  fi

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/package-lock.json .

RUN npm ci --omit=dev

EXPOSE 8080

CMD ["node", "dist/index.js"]

FROM build AS development

EXPOSE 8080

CMD ["npm", "run", "dev"]
