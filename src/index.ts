
import lodashKebabcase from 'lodash.kebabcase';

export interface BemModifiers {
    [name: string]: unknown;
}

export class Bem {
    public static readonly ELEMENT_DELIMITER = '__';
    public static readonly MODIFIER_DELIMITER = '--';

    public readonly block: string;
    public readonly element: string | undefined;
    public readonly modifiers: BemModifiers;
    public readonly globalModifiers: BemModifiers;

    private className: string | undefined = undefined;

    constructor(
        block: string,
        element?: string,
        modifiers: BemModifiers = {},
        globalModifiers: BemModifiers = {},
    ) {
        this.block = block;
        this.element = element;
        this.modifiers = modifiers;
        this.globalModifiers = globalModifiers;
    }

    public e(name: string): Bem {
        return new Bem(this.block, name, this.modifiers);
    }

    public m(modifiers: BemModifiers, globalModifiers: BemModifiers = {}): Bem {
        return new Bem(
            this.block,
            this.element,
            { ...this.modifiers, ...modifiers },
            { ...this.globalModifiers, ...globalModifiers },
        );
    }

    public toString(): string {
        if (this.className) {
            return this.className;
        }
        let className = this.block;
        if (this.element) {
            className += Bem.ELEMENT_DELIMITER + this.element;
        }
        const modifiers = Object.keys(this.modifiers)
            .filter(name => !!this.modifiers[name])
            .map(name => [
                className,
                Bem.MODIFIER_DELIMITER,
                lodashKebabcase(name) + (typeof this.modifiers[name] === 'string' ? `-${this.modifiers[name]}` : ''),
            ].join(''));
        Object.keys(this.globalModifiers)
            .filter(name => !!this.globalModifiers[name])
            .forEach(name => modifiers.push(
                Bem.MODIFIER_DELIMITER
                + lodashKebabcase(name)
                + (typeof this.globalModifiers[name] === 'string' ? `-${this.globalModifiers[name]}` : ''),
            ));
        return this.className = [className, ...modifiers].join(' ');
    }
}

export type BemElementHelperFunction = (modifiers?: BemModifiers, globalModifiers?: BemModifiers) => string;

export interface BemBlockHelperFunction {
    (modifiers?: BemModifiers, globalModifiers?: BemModifiers): string;
    e(name: string, modifiers?: BemModifiers, globalModifiers?: BemModifiers): string;
    createElement(name: string): BemElementHelperFunction;
}

export default function bem(blockName: string): BemBlockHelperFunction {
    const b = new Bem(blockName);
    const fn = (modifiers: BemModifiers = {}, globalModifiers: BemModifiers = {}) =>
        b.m(modifiers, globalModifiers).toString();
    fn.e = (name: string, modifiers: BemModifiers = {}, globalModifiers: BemModifiers = {}) =>
        b.e(name).m(modifiers, globalModifiers).toString();
    fn.createElement = (name: string) => {
        const e = b.e(name);
        return (modifiers: BemModifiers = {}, globalModifiers: BemModifiers = {}) =>
            e.m(modifiers, globalModifiers).toString();
    };
    return fn;
}
