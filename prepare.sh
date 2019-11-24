#!/bin/bash

set -ex

sudo -H pip install awscli --upgrade --user

sudo apt install npm

sudo npm install -g npx

npm init -y
npm install react-bootstrap bootstrap 
npm install babel-cli@6 babel-preset-react-app@3 
npm install uglify-js 
npm install minify
# npm install --save-dev @babel/core @babel/cli
# npm install --save-dev @babel/preset-react

npm install babel-preset-minify --save-dev
npm install babel-plugin-transform-remove-console --save-dev
npm install babel-plugin-transform-remove-debugger --save-dev
