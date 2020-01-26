import sqlite from 'sqlite3';
import uuid from 'uuid/v4';
import { rejects } from 'assert';

let db = new sqlite.Database('testDatabase.db');

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

export function insertInTable(tableName: string, columNames: any[], columValues: any[], callback: (err:any, row: any) => any) {

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
                
                
                //db.get(`SELECT * FROM ${tableName} WHERE id ="${columValues[0]}"`,(err,row) => {
                //    resolve(callback(err,row));
                //});
                
            }
        });

                
    });
}

    // private postRequest() {
    //     //insert users
    //     app.post('/table=:tableName', function(req, res) {
    //     let tableName = req.param('tableName');
    //     let name = req.body.name;

    //     //find a way to fix that
    //     //columes shoudn't be hardcoded
    //     let query = `INSERT INTO ${tableName} (id,name) VALUES("${uuid()}","${name}")`;

    //     db.run(query,(err) => {
    //         if(err)
    //         {
    //             console.log(err);
    //         } else {
    //             console.log(`data inserted in table ${tableName}`);
    //         }
    //     });
    //     res.sendStatus(200)});
    // } 

    // private deleteRequest() {
    //     //delete users
    //     app.delete('/table=:tableName', (req, res) =>{
    //         let tableName = req.param('tableName');

    //         let query = `DELETE FROM ${tableName}`;
    //         db.run(query,(err) =>{
    //             if(err)
    //             {
    //                     console.log(err);
    //             }else{
    //                 console.log(`deleted in table ${tableName}`);
    //             }
    //         });
    //         res.sendStatus(200);
    //     });

    //     app.delete('/table=:tableName/:id', (req, res) =>{
    //         let tableName = req.param('tableName');
    //         let id = req.param('id');
        
    //         let query = `DELETE FROM ${tableName} WHERE id="${id}"`;
    //         db.run(query,(err) =>{
    //             if(err)
    //             {
    //                     console.log(err);
    //             }else{
    //                 console.log(`data deleted in table ${tableName}`);
    //             }
    //         });
    //         res.sendStatus(200);
    //     });
    // }

    // private putRequest() {
    //     //update
    //     //table={table}/set=name="{data}"/{id}
    //     app.put(`/table=:tableName/set=:values/:id`, (req, res) => {
    //         let tableName = req.param(`tableName`);
    //         let values = req.param(`values`);
    //         let id = req.param(`id`);
            
    //         let query = `UPDATE ${tableName} SET ${values} WHERE id="${id}"`;
    //         db.run(query,(err) =>{
    //             if(err)
    //             {
    //                 console.log(err);
    //                 res.sendStatus(500);
    //                 return;
    //             }else{
    //                 console.log(`data updated in table ${tableName}`);
    //             }
    //         });
    //         res.sendStatus(200);
    //     });
    // }
