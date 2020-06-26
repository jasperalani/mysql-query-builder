/*
SELECT column1, column2, ...
FROM table_name;
 */

/*
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
 */

/*
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
 */

/*
DELETE FROM table_name WHERE condition;
 */

const { Database } = require('./database.js');

class Query {
    constructor(db) {
        this.db = db;
    }

    select(columns, table) {
        if(!columns || !table){
            return false;
        }

        let query = "SELECT ";

        let column_counter = 1,
            column_max_count = columns.length;
        for(const column of columns){
            const delimiter = query + column;
            query = column_counter !== column_max_count ? delimiter + ", " : delimiter + " ";
            column_counter++;
        }

        query = query + "FROM `" + table + "`;";

        let result_array = [];

        this.db.query(query, function (err, result) {
            if (err) throw err;
            result_array = result;
        });

        return result_array;
    }

    insert(columns, values, table) {
        if(!columns || !values || !table){
            return false;
        }

        let query = `INSERT INTO \`${table}\` `;

        let column_counter = 1,
            column_max_count = columns.length;
        for(const column of columns){
            const delimiter = query + column;
            if(column_counter === 1){
                query = query + "(" + column + ", ";
            }else if(column_counter === column_max_count) {
                query = query + column + ") ";
            }else{
                query = query + column + ", ";
            }
            column_counter++;
        }

        let value_counter = 1,
            value_max_count = columns.length;
        for(let value of values){
            const delimiter = query + value;
            if(value !== null){
                value = "'" + value + "'";
            }
            if(value_counter === 1){
                query = query + "VALUES (" + value + ", ";
            }else if(value_counter === value_max_count) {
                query = query + value + ");";
            }else{
                query = query + value + ", ";
            }
            value_counter++;
        }

        let result_array = [];

        this.db.query(query, function (err, result) {
            if (err) throw err;
            if(result){
                console.log(true)
            }else{
                console.log(false)
            }
        });

    }

    update(columns, values, condition, table) {
        if(!columns || !values || !condition || !table){
            return false;
        }

        let query = `UPDATE \`${table}\` SET `;

        let column_counter = 1,
            value_counter = 0,
            column_max_count = columns.length;
        for(const column of columns){
            if(Number.isInteger(values[value_counter])){
                values[value_counter] = values[value_counter];
            }else if(values[value_counter] !== null){
                values[value_counter] = "'" + values[value_counter] + "'";
            }
            const delimiter = query + column;
            if(column_counter === column_max_count) {
                query = query + column + " = " + values[value_counter];
            }else{
                query = query + column + " = " + values[value_counter] + ", ";
            }
            column_counter++;
            value_counter++;
        }

        if(condition !== null){
            query = query + " WHERE " + condition + ";";
        }else{
            query = query + ";";
        }

        this.db.query(query, function (err, result) {
            if (err) throw err;
            if(result){
                console.log(true)
            }else{
                console.log(false)
            }
        });

    }

    delete(condition, table) {
        if(!condition || !table){
            return false;
        }

        let query = `DELETE FROM \`${table}\` WHERE ` + condition;

        this.db.query(query, function (err, result) {
            if (err) throw err;
            if(result){
                console.log(true)
            }else{
                console.log(false)
            }
        });

    }

}