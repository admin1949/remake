import { Event } from './event';
import { Talent } from './talent';
import { Property, TYPES, TInitPerson } from './property';
import { clone } from './utils';

export class Life {
    private event = new Event;
    private property = new Property;
    private talent = new Talent;
    protected triggerTalents = new Map<number, number>()

    initial({ age, event, talent }: any) {
        this.event.initial(event);
        this.property.initial(age);
        this.talent.initial(talent);
    }

    restart(allocation: TInitPerson) {
        this.triggerTalents = new Map;
        const { newTalents, contents } =  this.talentReolace(allocation.TLT || []);

        allocation.TLT = newTalents;
        this.property.restart(allocation);

        this.doTalent();
        this.property.setRecord();

        return contents;
    }

    getTalentAllocationAddition(talents: number | number[]) {
        return this.talent.allocactionAddition(talents);
    }

    getTalentCurrentTriggerCount(talentId: string | number) {
        return this.triggerTalents.get(Number(talentId)) || 0;
    }

    next() {
        const { age, event, talent } = this.property.ageNext();

        const talentContent = this.doTalent(talent);
        const eventContent = this.doEvent(this.random(event));
        this.property.setRecord();

        const isEnd = this.property.isEnd();
        return { age, eventContent, talentContent, isEnd };
    }

    talentReolace(talents: number[]) {
        const result = this.talent.replace(talents);
        const contents: { type: string, source: ReturnType<Talent['get']>, target: ReturnType<Talent['get']> }[] = [];
        const newTalents = clone(talents);
        result.forEach((value, key) => {
            newTalents.push(value);
            const source = this.talent.get(key);
            const target = this.talent.get(value);
            contents.push({
                type: 'talentReplace',
                source,
                target,
            });
        })
        return {newTalents, contents};
    }

    doTalent(talents?: number[]) {
        if (talents) {
            this.property.change(TYPES.TLT, talents);
        }
        const allowTaletns = this.property.get(TYPES.TLT)
            .filter(talentId => this.getTalentCurrentTriggerCount(talentId) < this.talent.get(talentId).max_triggers);
        const contents = [];
        for (const talentId of allowTaletns) {
            const result = this.talent.do(talentId, this.property);
            if (!result) continue;
            this.triggerTalents.set(talentId, this.getTalentCurrentTriggerCount(talentId) + 1);
            const { effect, name, description, grade } = result;
            contents.push({
                type: TYPES.TLT,
                name,
                grade,
                description,
            });
            if (effect) {
                this.property.effect(effect);
            }
        }
        return contents;
    }

    doEvent(eventId: string | number): { type: TYPES, description: string, postEvent?: string}[] {
        const { effect = {}, next, description, postEvent } = this.event.do(eventId, this.property);
        this.property.change(TYPES.EVT, Number(eventId));
        this.property.effect(effect);
        const content = {
            type: TYPES.EVT,
            description,
            postEvent
        };
        if (next) {
            return [ content, ...this.doEvent(next)];
        }    
        return [ content ];
    }

    random(events: [number, number?][]) {
        const allowEvents = events.filter(([ eventId ]) => {
            return this.event.check(eventId, this.property);
        });
        let totalWeights = 0;
        for (const [, weight = 0] of allowEvents) {
            totalWeights += weight;
        }
        let random = Math.random() * totalWeights;

        for (const [eventId, weight = 0] of allowEvents) {
            if ((random -= weight) < 0) {
                return eventId;
            }
        }
        return allowEvents[allowEvents.length - 1][0];
    }

    talentRandom() {
        return this.talent.talentRandom(JSON.parse(localStorage.getItem('extendTalent') || 'null'));
    }
    getAllTalent() {
        return this.talent.getAllTalent();
    }

    getTalentItem(talentId: number) {
        return this.talent.get(talentId);
    }

    talentExtend(talentId: string) {
        localStorage.setItem('extendTalent', JSON.stringify(talentId));
    }

    getRecord() {
        return this.property.getRecorde();
    }

    getLastRecord() {
        return this.property.getLastRecorde();
    }

    exclusive(talents: number[], exclusive: number) {
        return this.talent.exclusive(talents, exclusive)
    }

}