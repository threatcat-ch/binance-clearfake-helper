# Clearfake binance Plugin

## Caution
This plugin uses 3th party code, not written by me in pako.min.js. This is used to decompress gzipped payloads.

## Introduction
This plugin has two actions.

### Map Functions
This action "renames" the functions of a binance contract, so you don't need to remember obscure hex values. 
Just add new mappings to popup.js

### Decode 
This function tries to decode the Payload (argument), that was provided to a function. 
Atm it tries to base64/gzip decompress if it finds the gzip header. If not it will do nothing. 