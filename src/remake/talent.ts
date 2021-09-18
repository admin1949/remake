import { Property, TYPES } from './property';
import { extractMaxTriggers, checkCondition, clone, weightRandom } from './utils';

type TTanlent = {
    [eventid: string]: {
        id: string | number;
        _id: number,
        name: string;
        description: string;
        grade: string | number;
        _grade: number;
        max_triggers: number,
        exclusive?: Array<string | number>;
        _exclusive: Array<number>;
        status?: number;
        condition?: string;
        effect?: {
            [TYPES.SPR]?: number;
            [TYPES.MNY]?: number;
            [TYPES.CHR]?: number;
            [TYPES.STR]?: number;
            [TYPES.INT]?: number;
        },
        replacement?: {
            grade?: number[],
            talent: (number | string)[],
        }
        _replacement?: {
            grade?: {
                [key: string]: number,
            },
            talent?: {
                [key: string]: number,
            },
        }
    }
}

export class Talent {
    protected talentsData: TTanlent | null = null;
    initial(talents: TTanlent) {
        this.talentsData = talents;
        for (const id in talents) {
            const talent = talents[id];
            talent._id = Number(talent.id);
            talent._grade = Number(talent.grade)
            talent._exclusive = talent.exclusive?.map(i => Number(i)) || [];
            talent.max_triggers = extractMaxTriggers(talent.condition);
            if (talent.replacement) {
                const _replacement = {};
                for(let key in talent.replacement) {
                    const obj = {};
                    for (let val of talent.replacement[key]) {
                        const value = String(val).split('*');
                        obj[value[0] || 0] = Number(value[1] || 1);
                    }
                    _replacement[key] = obj;
                }
                talent._replacement = _replacement;
            }
        }
    }

    count() {
        return Object.keys(this.talentsData || {}).length;
    }

    check(talentId: string, property: Property) {
        const { condition } = this.get(talentId);
        return checkCondition(property, condition);
    }

    get(talentId: string | number) {
        const talent = this.talentsData?.[talentId];
        if (!talent) throw new Error(`[ERROR] No Talent[${talentId}]`);
        return clone(talent);
    }

    information(talentId: string) {
        const { _grade, name, description } = this.get(talentId);
        return { name, description, grade: _grade };
    }

    exclusive(talends: number[], exclusiveId: number) {
        const { _exclusive: exclusive } = this.get(exclusiveId);
        if (!exclusive) {
            return null;
        }
        for (const talent of talends) {
            for (const e of exclusive) {
                if (talent == e) {
                    return talent;
                }
            }
        }
        return null;
    }
    talentRandom(includeId: string) {
        if (!this.talentsData) {
            throw new Error(`ERROR Talent has not inital`);
        }
        const talentMap = new Map<number, {id: number, grade: number, name: string, description: string }[]>();
        let include: null | { id: number, grade: number, name: string, description: string } = null;
        for (const talentId in this.talentsData) {
            const { _id, _grade, name, description, exclusive } = this.talentsData[talentId];
            let gradeItem = talentMap.get(_grade)
            if (!gradeItem) talentMap.set(_grade, gradeItem = []);
            const item = { id: _id, grade: _grade, name, description }
            if (talentId == includeId) {
                include = item;
            }

            gradeItem.push(item);
        }

        return Array.from({ length: 10 })
            .map((item, index) => {
                if (index === 0 && include) {
                    return include;
                }
                const random = Math.random();
                let grade = 0;
                if (random >= 0.111) grade = 0;
                else if (random >= 0.011) grade = 1;
                else if (random >= 0.001) grade = 2;
                else grade = 3;
                
                while(!talentMap.get(grade)?.length) {
                    grade--;
                }

                const len = talentMap.get(grade)?.length || 1;
                const i = Math.floor(Math.random() * len) % len;
                return talentMap.get(grade)!.splice(i, 1)[0];
            });
    }

    getAllTalent() {
        if (!this.talentsData) {
            throw new Error(`ERROR Talent has not inital`);
        }
        return Object.keys(this.talentsData)
            .sort((i, j) => {
                return this.talentsData![j]._grade -  this.talentsData![i]._grade;
            })
            .map(key => {
            const item = this.talentsData![key];
            return {
                id: item._id,
                grade: item._grade,
                name: item.name,
                description: item.description,
            }
        });
    }

    allocactionAddition(talents: number | number[]): number {
        if (Array.isArray(talents)) {
            return talents.reduce((i, j) => {
                return i + this.allocactionAddition(j)
            }, 0)
        }
        return Number(this.get(talents).status || 0);
    }

    do(talentId: string | number, property: Property) {
        const { effect, condition, _grade, name, description } = this.get(talentId);
        if (condition && !checkCondition(property, condition)) {
            return null;
        }
        return { effect, grade: _grade, name, description };
    }

    replace(talents: number[]) {
        if (!this.talentsData) {
            throw new Error('NO talents');
        }
        const getReplaceList = (talent: number, talents: number[]) => {
            const { _replacement } = this.get(talent);
            if (!_replacement) return false;

            const list: [number, number][] = [];
            if (_replacement.grade) {
                for (const key in this.talentsData!) {
                    const { _id, _grade } = this.talentsData[key];
                    if (!_replacement.grade[_grade]) continue;
                    if (this.exclusive(talents, _id)) continue;
                    list.push([_id, _replacement.grade[_grade]]);
                }
            }
            if (_replacement.talent) {
                for(const _id in _replacement.talent) {
                    const id = Number(_id);
                    if (this.exclusive(talents, id)) continue;
                    list.push([id, _replacement.talent[id]]);
                }
            }
            return list;
        }

        const replace = (talent: number, talents: number[]): number => {
            const replaceList = getReplaceList(talent, talents);
            if (!replaceList) return talent;
            if(!replaceList.length) {
                debugger;
            }
            const rand = weightRandom(replaceList); 
            return replace(rand, talents.concat(rand));

        }

        const newTalents = clone(talents);
        const result = new Map<number, number>();

        for (const talent of talents) {
            const replacedId = replace(talent, newTalents);
            if (replacedId !== talent) {
                result.set(talent, replacedId);
                newTalents.push(replacedId);
            }
        }

        return result;
    }
}