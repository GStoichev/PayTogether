export class User {

    private id_: string = "";
    private name_: string = "";
    private email_: string = "";
    private password_: string = "";

    constructor(id?: string, name?: string, email?: string) {
        if(id) {
            this.id_ = id;
        }

        if(name) {
            this.name_ = name;
        }

        if(email) {
            this.email_ = email;
        }   
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

    get password(): string {
        return this.password_;
    }

    set password(password: string) {
        this.password_ = password;
    }

}