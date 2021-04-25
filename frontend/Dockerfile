FROM node:15.9.0-slim as frontend
WORKDIR /app
COPY ./package.json /app/package.json
RUN yarn
COPY . /app
RUN yarn run build

FROM nginx:latest as static
COPY --from=frontend /app/build /app
