// MIT © 2017 azu
"use strict";
const fs = require('fs');
const path = require("path");
const StructuredSource = require('structured-source');
/**
 * Invalid Control Characters
 * @type {[string]}
 */
const InvalidControlCharacters = ['\u0008'];
/**
 * Escape to \uXXXX
 * @param {string} str
 * @return {string}
 */
const unicodeEscape = str => {
    return str.replace(/./g, c => {
        return `\\u${`000${c.charCodeAt(0).toString(16)}`.substr(-4)}`;
    });
};

const validateJSONInvalidCharacters = (content, characters) => {
    let error = null;
    const receiver = (key, value) => {
        if (typeof value !== "string") {
            return;
        }
        for (let i = 0; i < characters.length; i++) {
            const character = characters[i];
            const index = value.indexOf(character);
            if (index !== -1) {
                error = new Error(`Include invalid control charters: (${unicodeEscape(character)})
key:${key}, value:${value}`)
            }
        }
        return value;
    };
    try {
        JSON.parse(content, receiver);
        return error;
    } catch (error) {
        return;
    }
};
/**
 *
 * @param {string} filePath
 * @param {string[]} characters
 * @returns {undefined|Error}
 */
module.exports.validateInvalidControlCharacters = function validateInvalidControlCharacters(filePath, characters = InvalidControlCharacters) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const isJSON = path.extname(filePath) === ".json";
    if (isJSON) {
        const errorOrNot = validateJSONInvalidCharacters(content, characters);
        if (errorOrNot) {
            return errorOrNot;
        }
    }
    for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        const index = content.indexOf(character);
        if (index !== -1) {
            const source = new StructuredSource(content);
            const { line, column } = source.indexToPosition(index);
            return new Error(`Include invalid control charters: (${unicodeEscape(character)})
  at ${filePath}:${line}:${column}
`);
        }
    }
};
