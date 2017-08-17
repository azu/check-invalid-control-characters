#!/usr/bin/env node
'use strict';
const meow = require('meow');
const runCheck = require("../lib/cli").runCheck;

const cli = meow(`
    Usage
      $ check-invalid-control-characters <glob>

    Examples
      $ check-invalid-control-characters "src/**/*md"
          
`);

const input = cli.input[0];
if (!input) {
    cli.showHelp();
}

const errors = runCheck(input);
if (errors.length === 0) {
    process.exit(0);
}
errors.forEach(error => {
    console.error(error);
});
process.exit(1);
