// MIT © 2017 azu
"use strict";
const globby  = require("globby");
const { validateInvalidControlCharacters } = require("./check-invalid-control-characters");

/**
 * @param {string} glob
 * @return {Error[]}
 */
module.exports.runCheck = function runCheck(glob) {
    const targetFiles = globby.sync(glob, {
        onlyFiles: true,
        gitignore: true
    });
    return targetFiles.map(filePath => {
        return validateInvalidControlCharacters(filePath);
    }).filter(result => result !== undefined);
};
