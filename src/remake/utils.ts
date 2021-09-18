import { Property, TYPES } from './property';

type TConditions = (string | TConditions)[];

function parseCondition(condition: string) {
    const conditions: TConditions = [];
    const len = condition.length;
    const stack: TConditions[] = [conditions];

    let cursor = 0;

    const catchString = (index: number) => {
        const str = condition.substring(cursor, index).trim();
        cursor = index;
        if (str) {
            stack[0].push(str);
        }
    }

    for (let i = 0; i < len; i++) {
        switch(condition[i]) {
            case ' ':
                continue;
            case '(':
                catchString(i);
                cursor++;
                const sub: TConditions[] = [];
                stack[0].push(sub);
                stack.unshift(sub);
                break;
            case ')':
                catchString(i);
                cursor++;
                stack.shift();
                break;
            case '|':
            case '&':
                catchString(i);
                catchString(i+1);
                break;
            default:
                continue;
        }
    }
    catchString(len);
    return conditions;
}

export function checkCondition(property: Property, condition: string = '') {
    const conditions = parseCondition(condition);
    return checkParsedConditions(property, conditions);
}

function checkParsedConditions(property: Property, conditions: TConditions | string): boolean {
    if (!Array.isArray(conditions)) {
        return checkProperty(property, conditions);
    }
    if (!conditions.length) {
        return true;
    }
    if (conditions.length === 1) {
        return checkParsedConditions(property, conditions[0]);
    }

    let ret = checkParsedConditions(property, conditions[0]);
    for (let i = 1; i < conditions.length; i++) {
        switch(conditions[i]) {
            case '&':
                ret = ret && checkParsedConditions(property, conditions[i + 1]);
                break;
            case '|':
                return ret || checkParsedConditions(property, conditions[i + 1]);
            default:
                return false;
        }
    }
    return ret;
}

function checkProperty(property: Property, condition: string): boolean {
    const len = condition.length;
    let i = condition.search(/[><\!\?=]/);
    const prop = condition.substring(0, i);
    const symbol = condition.substring(i, i += (condition[i+1] == '=' ? 2 : 1));
    const d = condition.substring(i, len);

    const propData = property.get(prop as TYPES);
    const conditionData = d[0] === '[' ? JSON.parse(d) : Number(d);

    switch(symbol) {
        case '>': return propData > conditionData;
        case '<': return propData < conditionData;
        case '>=': return propData >= conditionData;
        case '<=': return propData <= conditionData;
        case '=':
            if (Array.isArray(propData)) {
                return propData.includes(conditionData);
            }
            return propData == conditionData;
        case '!=':
            if (Array.isArray(propData)) {
                return !propData.includes(conditionData);
            }
            return propData != conditionData;
        case '?':
            if (Array.isArray(propData)) {
                return propData.some(i => conditionData.includes(i));
            }
            return conditionData.includes(propData);
        case '!':
            if (Array.isArray(propData)) {
                return !propData.some(i => conditionData.includes(i));
            }
            return !conditionData.includes(propData);
        default:
            return false;
    }
}

export function extractMaxTriggers(condition: string = '') {
    const RE_AGE_CONDITION = /AGE\?\[([0-9\,]+)\]/;
    const match_object = RE_AGE_CONDITION.exec(condition);

    if (match_object === null) {
        return 1;
    }
    const age_list = match_object[1].split(',');
    return age_list.length;
}

export function clone<T extends unknown>(value: T): T {
    if (Array.isArray(value)) {
        return value.map(clone) as T;
    }
    switch(typeof value) {
        case 'object': 
            const newObj: T = {} as T;
            for (const key in value) {
                newObj[key] = clone(value[key]);
            }
            return newObj
        default:
            return value;
    }
}

export const weightRandom = (list: [number, number][]) => {
    let totalWeights = list.reduce((i, [, weight]) => {
        return i + weight;
    }, 0);

    let random = Math.random() * totalWeights;

    for (const [id, weight] of list) {
        if ((random -= weight) < 0) {
            return id;
        }
    }

    return list[list.length][0];
}

export const randomFromList = <T>(list: T[]):T => {
    let index = Math.floor(Math.random() * list.length);

    if (index === list.length) {
        index--;
    }
    return list[index];
}