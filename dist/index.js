"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_kebabcase_1 = __importDefault(require("lodash.kebabcase"));
class Bem {
    constructor(block, element, modifiers = {}, globalModifiers = {}) {
        this.className = undefined;
        this.block = block;
        this.element = element;
        this.modifiers = modifiers;
        this.globalModifiers = globalModifiers;
    }
    e(name) {
        return new Bem(this.block, name, this.modifiers);
    }
    m(modifiers, globalModifiers = {}) {
        return new Bem(this.block, this.element, Object.assign({}, this.modifiers, modifiers), Object.assign({}, this.globalModifiers, globalModifiers));
    }
    toString() {
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
            lodash_kebabcase_1.default(name) + (typeof this.modifiers[name] === 'string' ? `-${this.modifiers[name]}` : ''),
        ].join(''));
        Object.keys(this.globalModifiers)
            .filter(name => !!this.globalModifiers[name])
            .forEach(name => modifiers.push(Bem.MODIFIER_DELIMITER
            + lodash_kebabcase_1.default(name)
            + (typeof this.globalModifiers[name] === 'string' ? `-${this.globalModifiers[name]}` : '')));
        return this.className = [className, ...modifiers].join(' ');
    }
}
Bem.ELEMENT_DELIMITER = '__';
Bem.MODIFIER_DELIMITER = '--';
exports.Bem = Bem;
function bem(blockName) {
    const b = new Bem(blockName);
    const fn = (modifiers = {}, globalModifiers = {}) => b.m(modifiers, globalModifiers).toString();
    fn.e = (name, modifiers = {}, globalModifiers = {}) => b.e(name).m(modifiers, globalModifiers).toString();
    fn.createElement = (name) => {
        const e = b.e(name);
        return (modifiers = {}, globalModifiers = {}) => e.m(modifiers, globalModifiers).toString();
    };
    return fn;
}
exports.default = bem;
