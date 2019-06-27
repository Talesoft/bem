export interface BemModifiers {
    [name: string]: unknown;
}
export declare class Bem {
    static readonly ELEMENT_DELIMITER = "__";
    static readonly MODIFIER_DELIMITER = "--";
    readonly block: string;
    readonly element: string | undefined;
    readonly modifiers: BemModifiers;
    readonly globalModifiers: BemModifiers;
    private className;
    constructor(block: string, element?: string, modifiers?: BemModifiers, globalModifiers?: BemModifiers);
    e(name: string): Bem;
    m(modifiers: BemModifiers, globalModifiers?: BemModifiers): Bem;
    toString(): string;
}
export declare type BemElementHelperFunction = (modifiers?: BemModifiers, globalModifiers?: BemModifiers) => string;
export interface BemBlockHelperFunction {
    (modifiers?: BemModifiers, globalModifiers?: BemModifiers): string;
    e(name: string, modifiers?: BemModifiers, globalModifiers?: BemModifiers): string;
    createElement(name: string): BemElementHelperFunction;
}
export default function bem(blockName: string): BemBlockHelperFunction;
