ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN chown -R node:node /app

ENV PORT=3000

EXPOSE 3000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
CMD wget --spider http://localhost:${PORT}/health || exit 1

ENTRYPOINT [ "npm" ]

CMD [ "start" ]