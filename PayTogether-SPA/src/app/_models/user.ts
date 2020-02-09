import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class User {
    ui: UI;
    constructor() { }
}


export interface UI
{
    id_: string;
    name_: string;
    email_: string;
    password_: string;
}
