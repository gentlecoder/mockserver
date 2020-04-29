#!/usr/bin/env node
const shell = require('shelljs')

if (shell.exec('npm run start').code !== 0) {
  shell.echo('Error: Npm run start failed')
  shell.exit(1)
}
