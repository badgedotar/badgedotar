# Set base image
FROM node:16-buster AS base

WORKDIR /app/cardano

FROM base AS dependencies
# Installing cardano-cli dependencies
RUN apt update && apt install -y \
    automake \
    build-essential \
    pkg-config \
    libffi-dev \
    libgmp-dev \
    libssl-dev \
    libtinfo-dev \
    libsystemd-dev \
    zlib1g-dev \
    make \
    g++ \
    tmux \
    git \
    jq \
    wget \
    libncursesw5 \
    libtool \
    autoconf

# Installing ghcup
ENV BOOTSTRAP_HASKELL_NONINTERACTIVE true
ENV BOOTSTRAP_HASKELL_GHC_VERSION 8.10.7
ENV BOOTSTRAP_HASKELL_CABAL_VERSION 3.6.2.0
RUN curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | sh && \
    cp ~/.ghcup/bin/* /usr/local/bin && \
    # Check GHCup version
    ghcup --version && \
    # Check ghc and cabal versions
    ghc --version && cabal --version

FROM dependencies AS cardanocli

# Configure libsodium path
ENV LD_LIBRARY_PATH="/usr/local/lib:$LD_LIBRARY_PATH"
ENV PKG_CONFIG_PATH="/usr/local/lib/pkgconfig:$PKG_CONFIG_PATH"

# Download and compile cardano-cli
RUN mkdir -p ~/cardano-src && cd ~/cardano-src && \
    git clone https://github.com/input-output-hk/libsodium && \
    cd libsodium && \
    git checkout 66f017f1 && \
    ./autogen.sh && \
    ./configure && \
    make && \
    make install && \
    cd ~/cardano-src && \
    git clone https://github.com/input-output-hk/cardano-node.git && \
    cd cardano-node && \
    git fetch --all --recurse-submodules --tags && \
    git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-node/releases/latest | jq -r .tag_name) && \
    # Configure build options
    cabal configure --with-compiler=ghc-8.10.7
    # # Install LLVM for ARM
    # apt install -y llvm-9 clang-9 libnuma-dev && \
    # ln -s /usr/bin/llvm-config-9 /usr/bin/llvm-config && \
    # ln -s /usr/bin/opt-9 /usr/bin/opt && \
    # ln -s /usr/bin/llc-9 /usr/bin/llc && \
    # ln -s /usr/bin/clang-9 /usr/bin/clang

# Building and installing the node
RUN cabal build cardano-node cardano-cli && \
    # Installing commands
    mkdir -p ~/.local/bin && \
    cp -p "$(./scripts/bin-path.sh cardano-node)" ~/.local/bin/ && \
    cp -p "$(./scripts/bin-path.sh cardano-cli)" ~/.local/bin/ && \
    export PATH="~/.local/bin/:$PATH"

# Checking versions
RUN cardano-cli --version && cardano-node --version
