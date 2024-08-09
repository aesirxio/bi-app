
## builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY .git .
COPY nx.json .
COPY package.json .
COPY yarn.lock .

COPY packages packages

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake \
    git

RUN yarn install --frozen-lockfile --network-timeout 600000

# Build the app
RUN yarn build

# Bundle static assets
FROM node:18-alpine AS production
WORKDIR /app

# Copy built assets from builder
COPY --from=builder app/packages/aesirx-bi-app/build build

RUN yarn add serve react-inject-env

# Expose port
EXPOSE 3000

ENTRYPOINT npx react-inject-env set && npx serve -s build

ARG REACT_APP_ENDPOINT_URL
ARG REACT_APP_BI_ENDPOINT_URL
ARG REACT_APP_WEB3_API_ENDPOINT
ARG REACT_APP_ENDPOINT_ANALYTICS_URL
ARG REACT_APP_SSO_CLIENT_ID
ARG REACT_APP_SSO_CLIENT_SECRET
ARG REACT_APP_SSO_CONCORDIUM_NETWORK
ARG REACT_APP_WOOCOMMERCE_MENU
ARG REACT_APP_DATA_STREAM
ARG REACT_APP_DEMO_USER
ARG REACT_APP_DEMO_PASSWORD
ARG REACT_APP_LOGIN_EMAIL
