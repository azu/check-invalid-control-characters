// MIT © 2017 azu
"use strict";
const fs = require('fs');
const StructuredSource = require('structured-source');
/**
 * 利用してはいけない制御コードの一覧
 * @type {[string]}
 */
const invalidControlCharacters = ['\u0008'];
/**
 * \uXXXX 形式に文字列をエスケープする関数
 * @param {string} str
 * @return {string}
 */
const unicodeEscape = str => {
    return str.replace(/./g, c => {
        return `\\u${`000${c.charCodeAt(0).toString(16)}`.substr(-4)}`;
    });
};

/**
 *
 * @param {string} filePath
 * @param {string[]} characters
 * @returns {undefined|Error}
 */
module.exports.validateInvalidControlCharacters = function validateInvalidControlCharacters(filePath, characters = invalidControlCharacters) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (let i = 0; i < characters.length; i++) {
        const character = characters[i];
        const index = content.indexOf(character);
        if (index === -1) {
            continue; // ok
        }
        const source = new StructuredSource(content);
        const { line, column } = source.indexToPosition(index);
        return new Error(`制御文字(${unicodeEscape(character)})が含まれています。
  at ${filePath}:${line}:${column}
`);
    }
};