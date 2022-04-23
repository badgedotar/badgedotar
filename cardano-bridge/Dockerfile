FROM nessusio/cardano-node:1.30.1 AS base
ENV NODE_VERSION=16.13.1
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

FROM base AS dependencies
WORKDIR /app
COPY ["package.json", "package-lock.json"] .
RUN npm set progress=false && npm install node-appwrite && npm install

FROM base AS release
# Copy node_modules from dependencies
COPY --from=dependencies /app/node_modules ./node_modules
# Copy app sources
COPY . .

CMD ["npm", "run", "start"]