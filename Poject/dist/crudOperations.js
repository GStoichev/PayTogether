"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = __importDefault(require("sqlite3"));
var db = new sqlite3_1.default.Database('payTogether.db');
function getTableData(tableName, callback) {
    return new Promise(function (resolve, rejects) {
        db.all('SELECT * FROM ' + tableName, function (err, rows) {
            resolve(callback(err, rows));
        });
    });
}
exports.getTableData = getTableData;
function getTableDataById(tableName, id, callback) {
    return new Promise(function (resolve, reject) {
        var query = "SELECT * FROM " + tableName + " WHERE id =\"" + id + "\"";
        db.get(query, function (err, row) {
            resolve(callback(err, row));
        });
    });
}
exports.getTableDataById = getTableDataById;
function insertInTable(tableName, columNames, columValues, callback) {
    var columNamesAsString = columNames.reduce(function (previousValue, currentValue, currentIndex) {
        return previousValue ? previousValue + ", " + currentValue : currentValue;
    });
    var valuesAsString = columValues.reduce(function (previousValue, currentValue, currentIndex) {
        var modifiedCurrentValue = "";
        if (typeof currentValue === "string") {
            modifiedCurrentValue = "\"" + currentValue + "\"";
        }
        else if (typeof currentValue === "number") {
            modifiedCurrentValue = currentValue.toString();
        }
        else if (typeof currentValue === "boolean") {
            modifiedCurrentValue = currentValue.toString();
        }
        else {
            console.log("value type is missing");
        }
        return previousValue ? previousValue + ", " + modifiedCurrentValue : modifiedCurrentValue;
    }, "");
    return new Promise(function (resolve, reject) {
        var query = "INSERT INTO " + tableName + " (" + columNamesAsString + ") VALUES(" + valuesAsString + ")";
        db.run(query, function (err) {
            if (err) {
                //rejects(err);
                console.log(err);
            }
            else {
                getTableDataById(tableName, columNames[0], function (err, row) {
                    resolve(callback(err, row));
                });
            }
        });
    });
}
exports.insertInTable = insertInTable;
function insertInTableNoResponse(tableName, columNames, columValues, callback) {
    var columNamesAsString = columNames.reduce(function (previousValue, currentValue, currentIndex) {
        return previousValue ? previousValue + ", " + currentValue : currentValue;
    });
    var valuesAsString = columValues.reduce(function (previousValue, currentValue, currentIndex) {
        var modifiedCurrentValue = "";
        if (typeof currentValue === "string") {
            modifiedCurrentValue = "\"" + currentValue + "\"";
        }
        else if (typeof currentValue === "number") {
            modifiedCurrentValue = currentValue.toString();
        }
        else if (typeof currentValue === "boolean") {
            modifiedCurrentValue = currentValue.toString();
        }
        else {
            console.log("value type is missing");
        }
        return previousValue ? previousValue + ", " + modifiedCurrentValue : modifiedCurrentValue;
    }, "");
    return new Promise(function (resolve, reject) {
        var query = "INSERT INTO " + tableName + " (" + columNamesAsString + ") VALUES(" + valuesAsString + ")";
        db.run(query, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(callback(err));
            }
        });
    });
}
exports.insertInTableNoResponse = insertInTableNoResponse;
function deleteTableRow(tableName, id, callback) {
    return new Promise(function (resolve, rejects) {
        var query = "DELETE FROM " + tableName + " WHERE id=\"" + id + "\"";
        db.run(query, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                resolve(callback(err));
            }
        });
    });
}
exports.deleteTableRow = deleteTableRow;
function updateRecordInTable(tableName, id, columNames, columValues, callback) {
    var modifiedColumValues = columValues.map(function (value) {
        var modifiedCurrentValue = "";
        if (typeof value === "string") {
            modifiedCurrentValue = "\"" + value + "\"";
        }
        else if (typeof value === "number") {
            modifiedCurrentValue = value.toString();
        }
        else if (typeof value === "boolean") {
            modifiedCurrentValue = value.toString();
        }
        else {
            console.log("value type is missing");
        }
        return modifiedCurrentValue;
    });
    var zipedColumsAndNames = columNames.map(function (value, index) {
        return [value, modifiedColumValues[index]];
    });
    var valuesAsString = zipedColumsAndNames.reduce(function (previuseValue, currentValue, currentIndex) {
        var groupedValue = currentValue[0] + " = " + currentValue[1];
        return previuseValue ? previuseValue + " , " + groupedValue : groupedValue;
    }, "");
    return new Promise(function (resolve, rejects) {
        var query = "UPDATE " + tableName + " SET " + valuesAsString + " WHERE id=\"" + id + "\"";
        db.run(query, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            else {
                getTableDataById(tableName, id, function (err, row) {
                    resolve(callback(err, row));
                });
            }
        });
    });
}
exports.updateRecordInTable = updateRecordInTable;
