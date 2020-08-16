export interface Value {
    value: string | number | boolean
}

export interface Columns {
    columns: Array<Value>
}

export interface Values {
    values: Array<Value>
}

module.exports = {

    /**
     * Select columns from a table based on an optional condition.
     */
    select: function (
        columns: Columns,
        table: string,
        condition: string | null
    ) {
        let query: string = "SELECT ",
            column_counter: number = 1,
            column_max_count: number = columns.columns.length;

        for (const column of columns.columns) {
            const delimiter: string = query + column.value;
            query = column_counter !== column_max_count
                ? delimiter + ", "
                : delimiter + " ";
            column_counter++;
        }

        query = query + "FROM `" + table + "` ";

        if (condition.length > 0) {
            query = query + "WHERE " + condition;
        }

        query = query + ";";

        return query;
    },

    /**
     * Insert values into columns in table.
     */
    insert: function (
        columns: Columns,
        values: Values,
        table: string
    ) {
        if (columns.columns.length !== values.values.length) {
            return false;
        }

        let query = `INSERT INTO \`${table}\` `,
            column_counter = 1,
            column_max_count = columns.columns.length;

        for (const column of columns.columns) {
            const delimiter: string = query + column.value;
            if (column_counter === 1 && column_counter === column_max_count) {
                query = query + "(" + column.value + ") ";
            } else if (column_counter === 1) {
                query = query + "(" + column.value + ", ";
            } else if (column_counter === column_max_count) {
                query = delimiter + ") ";
            } else {
                query = delimiter + ", ";
            }
            column_counter++;
        }

        let value_counter = 1,
            value_max_count = columns.columns.length;

        for (let value of values.values) {
            if(typeof value.value === 'string'){
                value.value = "'" + value.value + "'";
            }

            const delimiter = query + value.value;

            if (value_counter === 1 && value_counter === value_max_count) {
                query = query + "VALUES (" + value.value + ")";
            } else if (value_counter === 1) {
                query = query + "VALUES (" + value.value + ", ";
            } else if (value_counter === value_max_count) {
                query = delimiter + ");";
            } else {
                query = delimiter + ", ";
            }

            value_counter++;
        }

        return query;
    },

    /**
     * Update columns in a table with values based on a condition.
     */
    update: function (
        columns: Columns,
        values: Values,
        condition: string | null,
        table: string
    ) {
        let query: string = `UPDATE \`${table}\` SET `;

        let column_counter = 1,
            value_counter = 0,
            column_max_count = columns.columns.length;

        for(const column of columns.columns){

            if(typeof values.values[value_counter] === 'string'){
                values.values[value_counter].value =
                    "'" + values.values[value_counter].value + "'";
            }

            let comma = column_counter !== column_max_count ? ', ' : '';

            query =
                query +
                column.value +
                " = " +
                values.values[value_counter].value +
                comma;

            column_counter++;
            value_counter++;
        }

        if(condition.length > 0){
            query = query + " WHERE " + condition + ";";
        }else{
            query = query + ";";
        }


        return query;
    },

    /**
     * Delete based on an optional condition.
     */
    delete: function (
        condition: string | null,
        table: string
    ) {
        condition = typeof condition !== 'string' ? 'true = true' : condition;
        return `DELETE FROM \`${table}\` WHERE ` + condition + ';';
    },

}