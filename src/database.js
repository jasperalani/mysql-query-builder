const mysql = require('mysql');

module.exports.Database = class {
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