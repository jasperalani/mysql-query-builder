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

const mysql = require('mysql');

class Query {
    constructor(db) {
        this.db = db;
    }

    select(columns, table) {
        if(!columns || !table){
            return false;
        }

        let query = "SELECT ";

        if(typeof columns === 'string'){
            columns = [columns];
        }

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

    async insert(columns, values, table) {
        if(!columns || !values || !table){
            return false;
        }

        if(typeof columns === 'string'){
            columns = [columns];
        }

        if(typeof values === 'string'){
            values = [values];
        }

        let query = `INSERT INTO \`${table}\` `;

        let column_counter = 1,
            column_max_count = columns.length;

        for(const column of columns){
            const delimiter = query + column;
            if(column_counter === 1 && column_counter === column_max_count){
                query = query + "(" + column + ") ";
            }else if(column_counter === 1){
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
            if(value_counter === 1 && value_counter === value_max_count){
                query = query + "VALUES (" + value + ")";
            }else if(value_counter === 1){
                query = query + "VALUES (" + value + ", ";
            }else if(value_counter === value_max_count) {
                query = delimiter + ");";
            }else{
                query = delimiter + ", ";
            }
            value_counter++;
        }

        await this.db.query(query, function (err, result) {
            if (err) throw err;
            if(result){
                console.log(true)
            }else{
                console.log(false)
            }
            process.exit();
        });
    }

    /**
     * Update columns in a table with values based on a condition.
     *
     * @param {string|array} columns
     * @param {string|array} values
     * @param {string} condition
     * @param {string} table
     *
     * @return object
     * {status: boolean, message: string}
     */
    update(columns, values, condition, table)
    {
        if(!columns || !values || !condition || !table){
            return false;
        }

        let query = `UPDATE \`${table}\` SET `;

        if(typeof columns === 'string'){
            columns = [columns];
        }

        if(typeof values === 'string'){
            values = [values];
        }

        let column_counter = 1,
            value_counter = 0,
            column_max_count = columns.length;

        for(const column of columns){
            if(
                values[value_counter] !== null &&
                ! Number.isInteger(values[value_counter])
            ){
                values[value_counter] = "'" + values[value_counter] + "'";
            }

            const delimiter = query + column;
            if(column_counter === column_max_count) {
                query = delimiter + " = " + values[value_counter];
            }else{
                query = delimiter + " = " + values[value_counter] + ", ";
            }

            column_counter++;
            value_counter++;
        }

        if(condition !== null){
            query = query + " WHERE " + condition + ";";
        }else{
            query = query + ";";
        }

        let query_result;

        this.db.query(query, function (err, result) {
            if (err) throw err;
            query_result = result;
        });

        if(query_result !== undefined){
            if(query_result.OkPacket.affectedRows === 0){
                return {
                    status: false,
                    message: 'Condition matched no rows'
                };
            }

            /** @param OkPacket.changedRows */
            if(query_result.OkPacket.changedRows === 0){
                return {
                    status: false,
                    message: 'Condition matched rows but value was not changed'
                };
            }else{
                return {
                    status: true,
                    message: 'Rows updated'
                };
            }
        }else{
            return {
                status: false,
                message: 'Failed to query database'
            }
        }

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

class DatabaseConnection {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
    }

    connection() {
        const conn = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });
        conn.connect(function(err) {
            if (err) throw err;
        });
        return conn;
    }
}

// const Database = new DatabaseConnection('127.0.0.1', 'root', 'password', 'mysql-query-builder').connection();
// const Update = new Query(Database).update('testcase', 'noodlepoodle', 'id = 7', 'test-queries');
//
// console.log(Update)
