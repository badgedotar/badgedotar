# ---- Base Node ----
#FROM alpine:3 AS base
FROM mhart/alpine-node:16.4.2 AS base


# # Install dependencies
RUN apk add --no-cache tini python3 make g++ jq

# Set working directory
WORKDIR /app
# set tini as entrypoint
ENTRYPOINT [ "/sbin/tini", "--" ]
# copy package.json
COPY ["package.json", "package-lock.json", "./"]

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false
RUN npm install

# ---- Build ----
FROM base AS builder
WORKDIR /app
# # Increase node memory
ENV NODE_OPTIONS="--max-old-space-size=2048"
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Release ----
FROM base AS release
# copy production node modules
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# copy app sources
COPY . .
CMD npm start