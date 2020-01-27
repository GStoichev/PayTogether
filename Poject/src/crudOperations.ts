import sqlite from 'sqlite3';
import uuid from 'uuid/v4';
import { rejects } from 'assert';
import { resolve } from 'dns';

let db = new sqlite.Database('payTogether.db');

export function getTableData(tableName: string, callback: (err: any, rows: any[]) => any): any {
    return new Promise((resolve,rejects) => {    
        db.all('SELECT * FROM '+ tableName, function (err, rows) {
                resolve(callback(err,rows));
            }); 
        });   
}

export function getTableDataById(tableName: string, id: string, callback: (err: any, row: any) => any): any {
            return new Promise((resolve, reject) => {
                let query = `SELECT * FROM ${tableName} WHERE id ="${id}"`;
                db.get(query, function (err, row) {
                    resolve(callback(err,row));
                });
            });
}

export function insertInTable(tableName: string, columNames: any[], columValues: any[], callback: (err:any, row: any) => any): any {

    let columNamesAsString = columNames.reduce((previousValue,currentValue,currentIndex) => {
        return previousValue ? previousValue +  ", " + currentValue : currentValue;
    });

    let valuesAsString = columValues.reduce((previousValue,currentValue,currentIndex) => {
        let modifiedCurrentValue = "";
        if(typeof currentValue === "string") {
            modifiedCurrentValue = `\"` + currentValue + `\"`;
        } else if(typeof currentValue === "number") {
            modifiedCurrentValue = currentValue.toString();
        } else if (typeof currentValue === "boolean") {
            modifiedCurrentValue = currentValue.toString();
        } else {
            console.log("value type is missing");
        }

        return previousValue ? previousValue +  ", " + modifiedCurrentValue : modifiedCurrentValue;
    },"");

    return new Promise((resolve, reject) => {
        let query = `INSERT INTO ${tableName} (${columNamesAsString}) VALUES(${valuesAsString})`;
        db.run(query,(err) => {
            if(err)
            {
                //rejects(err);
                console.log(err);
            } else {
                getTableDataById(tableName,columNames[0], function(err, row) {
                    resolve(callback(err,row));
                });
            }
        });

                
    });
}

export function deleteTableRow(tableName: string, id: string, callback :(err: any) => any): any {
    return new Promise((resolve, rejects) => {
        let query = `DELETE FROM ${tableName} WHERE id="${id}"`;
        db.run(query,(err) =>{
            if(err)
            {
                console.log(err);
            } else{
                resolve(callback(err));
            }
        });
    });
}

export function updateRecordInTable(tableName: string, id: string, columNames: any[], columValues: any[], callback :(err: any, row: any) => any): any {
    
    let modifiedColumValues = columValues.map((value) => {
        let modifiedCurrentValue = "";
        if(typeof value === "string") {
            modifiedCurrentValue = `\"` + value + `\"`;
        } else if(typeof value === "number") {
            modifiedCurrentValue = value.toString();
        } else if (typeof value === "boolean") {
            modifiedCurrentValue = value.toString();
        } else {
            console.log("value type is missing");
        }
        return modifiedCurrentValue;
    });

    let zipedColumsAndNames = columNames.map((value,index) => {
        return [value, modifiedColumValues[index]];
    });

    let valuesAsString = zipedColumsAndNames.reduce((previuseValue, currentValue, currentIndex) => {
        let groupedValue = currentValue[0] + " = " + currentValue[1];
        return previuseValue ? previuseValue + " , " + groupedValue : groupedValue;
    },"");
    

    return new Promise((resolve, rejects) => {
        let query = `UPDATE ${tableName} SET ${valuesAsString} WHERE id="${id}"`;
        db.run(query,(err) =>{
            if(err)
            {
                console.log(err);
                return;
            }else{
                getTableDataById(tableName, id , function(err, row) {
                    resolve(callback(err,row));
                });
            }
        });
    });
}