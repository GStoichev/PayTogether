export class User {

    constructor(private id_: string, private name_: string, private email_: string) {
    
    }

    get id(): string {
        return this.id_;
    }

    set id(id: string) {
        this.id_ = id;
    }

    get name(): string {
        return this.name_;
    }

    set name(name: string) {
        this.name_ = name;
    } 

    get email(): string {
        return this.email_;
    }

    set email(email: string) {
        this.email_ = email;
    }

}