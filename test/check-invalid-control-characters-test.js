// MIT © 2017 azu
"use strict";
const assert = require("assert");
const path = require("path");
const { validateInvalidControlCharacters } = require("../lib/check-invalid-control-characters");
describe("check-invalid-control-characters", () => {
    it("should pass ", () => {
        const error = validateInvalidControlCharacters(path.join(__dirname, "fixtures/pass.txt"));
        assert.ok(error === undefined);
    });
    it("should report error if include invalid characters", () => {
        const error = validateInvalidControlCharacters(path.join(__dirname, "fixtures/test.txt"));
        assert.ok(error instanceof Error, "should be reported error");
    });
    it("should report error if json include invalid characters", () => {
        const error = validateInvalidControlCharacters(path.join(__dirname, "fixtures/test.json"));
        assert.ok(error instanceof Error, "should be reported error");
    });
});