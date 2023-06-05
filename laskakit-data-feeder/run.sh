#!/usr/bin/with-contenv bashio
set +u

export IMAGE_TO_CONSOLE=$(bashio::config 'image_to_console')
export LASKAKIT_URL=$(bashio::config 'laskakit_url')
export LOG_LEVEL=$(bashio::config 'log_level')

bashio::log.info "Starting Homeassistant Add-on LaskaKit data feeder."
yarn start:prod