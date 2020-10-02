module.exports.QueryBuilder = {
  /**
   * Select columns from a table based on an optional condition.
   *
   * @param {string|string[]} columns
   * @param {string} table
   * @param {null|string} condition
   *
   * @return {boolean|string} MySQL Query
   */
  select (columns, table, condition = null) {
    if (!columns || !table) {
      return false
    }

    let query = 'SELECT '

    if (typeof columns === 'string') {
      columns = [columns]
    }

    let column_counter = 1,
      column_max_count = columns.length

    for (const column of columns) {
      const delimiter = query + column
      query = column_counter !== column_max_count
        ? delimiter + ', '
        : delimiter + ' '
      column_counter++
    }

    query = query + 'FROM `' + table + '` '

    if (condition !== null && condition.length > 0) {
      query = query + 'WHERE ' + condition
    }

    query = query + ';'

    return query
  },

  /**
   * Insert values into columns in table.
   *
   * @param {string|array} columns
   * @param {string|array} values
   * @param {string} table
   *
   * @return {boolean|string} MySQL Query
   */
  insert (columns, values, table) {
    if (!columns || !values || !table) {
      return false
    }

    if (typeof columns === 'string') {
      columns = [columns]
    }

    if (typeof values === 'string') {
      values = [values]
    }

    if (columns.length !== values.length) {
      return false
    }

    let query = `INSERT INTO \`${table}\` `

    let column_counter = 1,
      column_max_count = columns.length

    for (const column of columns) {
      const delimiter = query + column
      if (column_counter === 1 && column_counter === column_max_count) {
        query = query + '(' + column + ') '
      } else if (column_counter === 1) {
        query = query + '(' + column + ', '
      } else if (column_counter === column_max_count) {
        query = query + column + ') '
      } else {
        query = query + column + ', '
      }
      column_counter++
    }

    let value_counter = 1,
      value_max_count = columns.length
    for (let value of values) {
      if (value !== null) {
        value = '\'' + value + '\''
      }
      const delimiter = query + value
      if (value_counter === 1 && value_counter === value_max_count) {
        query = query + 'VALUES (' + value + ')'
      } else if (value_counter === 1) {
        query = query + 'VALUES (' + value + ', '
      } else if (value_counter === value_max_count) {
        query = delimiter + ');'
      } else {
        query = delimiter + ', '
      }
      value_counter++
    }

    return query
  },

  /**
   * Update columns in a table with values based on a condition.
   *
   * @param {string|array} columns
   * @param {string|array} values
   * @param {string} condition
   * @param {string} table
   *
   * @return {boolean|string} MySQL Query
   */
  update (columns, values, condition, table) {
    if (!columns || !values || !condition || !table) {
      return false
    }

    let query = `UPDATE \`${table}\` SET `

    if (typeof columns === 'string') {
      columns = [columns]
    }

    if (typeof values === 'string') {
      values = [values]
    }

    let column_counter = 1,
      value_counter = 0,
      column_max_count = columns.length

    for (const column of columns) {
      if (
        values[value_counter] !== null &&
        !Number.isInteger(values[value_counter])
      ) {
        values[value_counter] = '\'' + values[value_counter] + '\''
      }

      const delimiter = query + column
      if (column_counter === column_max_count) {
        query = delimiter + ' = ' + values[value_counter]
      } else {
        query = delimiter + ' = ' + values[value_counter] + ', '
      }

      column_counter++
      value_counter++
    }

    if (condition.length > 0) {
      query = query + ' WHERE ' + condition + ';'
    } else {
      query = query + ';'
    }

    return query
  },

  /**
   * Delete based on a condition.
   *
   * @param {string} condition
   * @param {string} table
   *
   * @return {boolean|string} MySQL Query
   */
  delete (condition, table) {
    if (!condition || !table) {
      return false
    }

    return `DELETE FROM \`${table}\` WHERE ` + condition + ';'
  },
}

module.exports.Condition = {
  /**
   * @param columns column(s)
   * @param values value(s)
   * @param operators operator(s)
   * @returns {string|boolean}
   */
  where: (columns, values, operators) => {
    if (typeof columns === 'string') {
      columns = [columns]
    }
    if (typeof values === 'string') {
      values = [values]
    }
    if (typeof operators === 'string') {
      operators = [operators]
    }
    if (columns.length !== values.length) {
      return false
    }
    let id = 0
    let sql = ''
    for (const column of columns) {
      if (id !== 0) {
        sql = sql + ' AND '
      }
      let integerValue = parseInt(values[id])
      if (isNaN(integerValue)) {
        values[id] = '\'' + values[id] + '\''
      }
      let operator = operators[id]
      if (operators.length === 1) {
        operator = operators[0]
      }
      sql = sql + column + ' ' + operator + ' ' + values[id]
      id++
    }
    return sql
  },
}