"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRulesAreValid = exports.validatePassword = exports.validationRules = void 0;
exports.validationRules = [
    {
        id: "lowercase",
        name: "Lower-case",
        check: function (value) { return /[a-z|ç|ş|ö|ü|ı|ğ]/u.test(value); },
    },
    {
        id: "uppercase",
        name: "Upper-case",
        check: function (value) { return /[A-Z|Ç|Ş|Ö|Ü|İ|Ğ]/u.test(value); },
    },
    {
        id: "number",
        name: "Number",
        check: function (value) { return /[0-9]/.test(value); },
    },
    {
        id: "minChar",
        name: "At least 8 characters",
        check: function (value) { return value.length >= 8; },
    },
];
function ruleToResultMapper(rule, password) {
    return __assign(__assign({}, rule), { valid: rule.check(password) });
}
function validatePassword(password) {
    return exports.validationRules.map(function (rule) { return ruleToResultMapper(rule, password); });
}
exports.validatePassword = validatePassword;
function allRulesAreValid(validationResults) {
    return validationResults
        .map(function (result) { return result.valid; })
        .reduce(function (valid1, valid2) { return valid1 && valid2; });
}
exports.allRulesAreValid = allRulesAreValid;
