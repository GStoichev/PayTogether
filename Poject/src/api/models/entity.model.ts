export interface ParticipantMoneyChange {
    id: number,
    current_amount: number
}

export interface Participant {
    fr_1_id: string,
    fr_2_id: string,
    money: number
}

export interface ParticipantsForPreview {
    myName: string,
    otherName: string,
    money: number,
    income: boolean
}

export interface EntityWithParticipants {
    entity: Entity,
    participants: Array<Participant>
}

export interface EntityForPreview {
    entity: Entity,
    participants: Array<ParticipantsForPreview>
}

export class Entity {

    private id_: number = 0;
    private name_: string = "";
    private desc_: string = "";
    private date_: Date = new Date();

    constructor(id?: number, name?: string, desc?: string, date?: Date) {
        if(id) {
            this.id_ = id;
        }

        if(name) {
            this.name_ = name;
        }

        if(desc) {
            this.desc_ = desc;
        }   

        if(date) {
            this.date_ = date;
        }   
    }

    get id(): number {
        return this.id_;
    }

    set id(id: number) {
        this.id_ = id;
    }

    get name(): string {
        return this.name_;
    }

    set name(name: string) {
        this.name_ = name;
    } 

    get desc(): string {
        return this.desc_;
    }

    set desc(desc: string) {
        this.desc_ = desc;
    }

    get date(): Date {
        return this.date_;
    }

    set date(date: Date) {
        this.date_ = date;
    }

}