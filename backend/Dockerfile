# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.2.2
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV LANG=C.UTF-8 \
  TZ=Asia/Tokyo \
  RAILS_ENV="production" \
  BUNDLE_PATH="/usr/local/bundle" \
  BUNDLE_JOBS=4 \
  BUNDLE_RETRY=3

# --- Build stage ---
FROM base AS build

ENV BUNDLE_WITHOUT="" \
  BUNDLE_DEPLOYMENT="0"

# Install build dependencies for gems with native extensions
# AND runtime dependencies that might be needed during bundle install (e.g., for pg gem)
RUN apt-get update -qq && \
  apt-get install -y --no-install-recommends \
  build-essential \
  libpq-dev \
  git \
  pkg-config \
  zlib1g-dev && \
  rm -rf /var/lib/apt/lists/*

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install all gems including development and test
RUN bundle config set --local without 'development:test' && \
  bundle install --jobs 4 --retry 3 && \
  rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

# Copy application code
COPY . .

# Skip bootsnap precompilation for now
# RUN bundle exec bootsnap precompile app/ lib/

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y \
  curl \
  libvips \
  postgresql-client \
  zlib1g && \
  rm -rf /var/lib/apt/lists/* /var/cache/apt/archives

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Create necessary directories and set permissions
RUN mkdir -p db log storage tmp && \
    useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /usr/local/bundle db log storage tmp /rails
USER rails:rails

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]
