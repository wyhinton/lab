export interface ValidationRule {
    id: string;
    name: string;
    check: (value: string) => boolean;
}
export declare type ValidationResult = Omit<ValidationRule, "check"> & {
    valid: boolean;
};
export declare const validationRules: ValidationRule[];
export declare function validatePassword(password: string): ValidationResult[];
export declare function allRulesAreValid(validationResults: ValidationResult[]): boolean;
//# sourceMappingURL=index.d.ts.map