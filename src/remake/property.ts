import { clone, randomFromList } from './utils';

type TAgedata = {
    [ageId: string]: {
        age?: string,
        event?: string | string[],
        _event?: [number, number?][],
        talent?: string | string[],
        _talent?: number[]
    }
}
export enum TYPES {
    AGE= "AGE", // 年龄 age AGE
    CHR= "CHR", // 颜值 charm CHR
    INT= "INT", // 智力 intelligence INT
    STR= "STR", // 体质 strength STR
    MNY= "MNY", // 家境 money MNY
    SPR= "SPR", // 快乐 spirit SPR
    LIF= "LIF", // 生命 life LIFE
    TLT= "TLT", // 天赋 talent TLT
    EVT= "EVT", // 事件 event EVT
    RDM = 'RDM', // 更改随机属性
};

const SPECIAL = {
    [TYPES.RDM]: [
        TYPES.CHR,
        TYPES.INT,
        TYPES.STR,
        TYPES.MNY,
        TYPES.SPR,
    ]
}

type TPerson = {
    [TYPES.AGE]: number;
    [TYPES.CHR]: number;
    [TYPES.INT]: number;
    [TYPES.STR]: number;
    [TYPES.MNY]: number;
    [TYPES.SPR]: number;
    [TYPES.LIF]: number;
    [TYPES.TLT]: number[];
    [TYPES.EVT]: number[];
    [TYPES.RDM]: number,
}

export type TRecorde = {
    [TYPES.AGE]: number;
    [TYPES.CHR]: number;
    [TYPES.INT]: number;
    [TYPES.STR]: number;
    [TYPES.MNY]: number;
    [TYPES.SPR]: number;
}

export type TInitPerson = {
    [key in keyof TPerson]?: TPerson[key]
}


export class Property {

    protected ageData: TAgedata | null= null;
    protected person: TPerson;
    protected record: TRecorde[] = [];

    constructor() {
        this.person = this.getDefaultPerson();
    }

    protected getDefaultPerson() {
        return {
            [TYPES.AGE]: -1,

            [TYPES.CHR]: 0,
            [TYPES.INT]: 0,
            [TYPES.STR]: 0,
            [TYPES.MNY]: 0,
            [TYPES.SPR]: 0,

            [TYPES.LIF]: 0,

            [TYPES.TLT]: [],
            [TYPES.EVT]: [],

            [TYPES.RDM]: 0,
        }
    }

    initial(ageData: TAgedata) {
        this.ageData = ageData;
        for (const ageId in ageData) {
            let { age, event, talent } = ageData[ageId];
            if (!Array.isArray(event)) {
                event = event?.split(',') || [];
            }
            if (!Array.isArray(talent)) {
                talent = talent?.split(',') || [];
            }
            const _event = event.map((e): [number, number?] => {
                const value = `${e}`.split('*').map(Number);
                return value.length == 1 ? [value[0]] : [value[0], value[1]];
            });
            const _talent = talent.map(Number)
            ageData[ageId] = { _event, _talent };
        }
    }

    restart(person: TInitPerson) {
        this.person = this.getDefaultPerson();
        this.record = [];
        this.effect(person);
    }


    get<T extends TYPES>(key: T) {
        return clone(this.person[key]);
    }
    set<T extends TYPES>(key: T, value: TPerson[T]) {
        this.person[key] = clone(value);
    }

    setRecord() {
        this.record.push({
            [TYPES.AGE]: this.get(TYPES.AGE),
            [TYPES.CHR]: this.get(TYPES.CHR),
            [TYPES.INT]: this.get(TYPES.INT),
            [TYPES.STR]: this.get(TYPES.STR),
            [TYPES.MNY]: this.get(TYPES.MNY),
            [TYPES.SPR]: this.get(TYPES.SPR),
        })
    }
    getRecorde() {
        return clone(this.record);
    }
    getLastRecorde() {
        return clone(this.record[this.record.length - 1]);
    }


    change(key: TYPES, value: number | number[]) {
        if (Array.isArray(value)) {
            for (const v of value) {
                this.change(key, v);
            }
            return
        }
        switch(key) {
            case TYPES.AGE:
            case TYPES.CHR:
            case TYPES.INT:
            case TYPES.STR:
            case TYPES.MNY:
            case TYPES.SPR:
            case TYPES.LIF:
            case TYPES.RDM:
                this.person[key] += value;
                break;
            case TYPES.TLT:
            case TYPES.EVT:
                const v = this.person[key];
                if (value < 0) {
                    const index = v.indexOf(value);
                    if (index !== -1) {
                        v.splice(index, 1);
                    }
                }
                if (!v.includes(value)) {
                    v.push(value);
                }
                break;
            default:
                return;
        }
    }

    hookSpecial(key: TYPES, value: number) {
        switch(key) {
            case TYPES.RDM:
                this.change(TYPES.RDM, value);
                return randomFromList(SPECIAL[TYPES.RDM]);
            default:
                return key;
        }
    }
    
    effect(effect: TInitPerson) {
        for (let key in effect) {
            this.change(
                this.hookSpecial(key as TYPES, effect[key]),
                effect[key],
            );
        }
    }
    isEnd() {
        return this.get(TYPES.LIF) < 1;
    }
    ageNext() {
        this.change(TYPES.AGE, 1);
        const age = this.get(TYPES.AGE);
        const { _event = [], _talent = [] } = this.getAgeData(age);

        return { age, event: _event, talent: _talent};
    }
    getAgeData(age: string | number) {
        return clone(this.ageData?.[age] || {});
    }
}
