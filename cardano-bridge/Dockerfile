FROM --platform=linux/arm64/v8 nessusio/cardano-node:1.30.1-dev AS base
ENV NODE_VERSION=16.13.1
RUN apt install -y curl tini
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
ENTRYPOINT [ "/usr/bin/tini", "--" ]

FROM --platform=linux/arm64v8 base AS dependencies
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm set progress=false
RUN npm install

FROM --platform=linux/arm64v8 base AS release
# Copy node_modules from dependencies
COPY --from=dependencies /app/node_modules ./node_modules
# Copy app sources
COPY . .

CMD ["npm", "run", "start"]