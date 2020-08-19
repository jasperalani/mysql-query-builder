package main

import "log"

type (
	Columns []string
	Values  []Value
)

type Condition struct {
	condition string
	empty     bool
}

type Value struct {
	string string
	bool   bool
	int    int
	type_  string
}

// Redo value struct taking out type_ and using reflect.type

func Select(columns Columns, table string, condition Condition) string {

	var (
		query          = "SELECT "
		columnCounter  = 1
		columnMaxCount = len(columns)
	)

	for _, column := range columns {
		if columnCounter == columnMaxCount {
			query = query + column + " "
		} else {
			query = query + column + ", "
		}
		columnCounter++
	}

	query = query + "FROM `" + table + "` "

	if !condition.empty {
		query = query + "WHERE " + condition.condition
	}

	query = query + ";"

	return query

}

func Insert(columns Columns, values Values, table string) string {

	if len(columns) != len(values) {
		return ""
	}

	var (
		query          = "INSERT INTO `" + table + "` "
		columnCounter  = 1
		columnMaxCount = len(columns)
		valueCounter   = 1
		valueMaxCount  = len(values)
	)

	for index, column := range columns {

		if index == 0 && columnCounter == columnMaxCount {
			query = query + "(" + column + ") "
		} else if index == 0 && columnCounter != columnMaxCount {
			query = query + "(" + column + ", "
		} else if columnCounter == columnMaxCount {
			query = query + column + ") "
		} else {
			query = query + column + ", "
		}

		columnCounter++

	}

	for index, value := range values {

		if value.type_ == "string" {
			value.string = "'" + value.string + "'"
		}

		var typedValue = returnTypedValue(value)

		if index == 0 && valueCounter == valueMaxCount {
			query = query + "VALUES (" + typedValue.(string) + ")"
		} else if valueCounter == 1 {
			query = query + "VALUES (" + typedValue.(string) + ", "
		} else if valueCounter == valueMaxCount {
			query = query + typedValue.(string) + ");"
		} else {
			query = query + typedValue.(string) + ", "
		}

		valueCounter++

	}

	return query

}

func Update(columns Columns, values Values, table string, condition Condition) string {

	if len(columns) != len(values) {
		return ""
	}

	var (
		query          = "UPDATE `" + table + "` SET "
		columnCounter  = 1
		columnMaxCount = len(columns)
		valueCounter   = 1
		typedValue     interface{}
		comma          string
	)

	for index, column := range columns {

		var value = values[index]

		if value.type_ == "string" {
			value.string = "'" + value.string + "'"
		}

		typedValue = returnTypedValue(value)

		if columnCounter == columnMaxCount {
			comma = ""
		} else {
			comma = ", "
		}

		query =
			query +
				column +
				" = " +
				typedValue.(string) +
				comma

		columnCounter++
		valueCounter++

	}

	if !condition.empty {
		query = query + " WHERE " + condition.condition + ";"
	} else {
		query = query + ";"
	}

	return query

}

func Delete(table string, condition Condition) string {

	if condition.empty {
		condition.condition = "true = true"
	}

	return "DELETE FROM `" + table + "` WHERE " + condition.condition + ";"

}

func returnTypedValue(value Value) interface{} {
	switch value.type_ {
	case "string":
		return value.string
	case "bool":
		return value.bool
	case "int":
		return value.int
	default:
		return ""
	}
}

func main () {

	var (
		table = "my_table"

		condition = Condition{
			condition: "id = 6",
			empty: false,
		}

		column1 = "column_1"
		column2 = "column_2"
		column3 = "column_3"

		columns = Columns{column1, column2, column3}

		value1 = Value{
			string:  "value_1",
			type_: "string",
		}
		value2 = Value{
			bool: false,
			type_: "bool",
		}
		value3 = Value{
			int: 6,
			type_: "int",
		}

		values = Values{value1, value2, value3}
	)


	var (
		select_ = Select(columns, table, condition)
		insert = Insert(columns, values, table)
		update = Update(columns, values, table, condition)
		delete_ = Delete(table, condition)
	)

	log.Println(select_)
	log.Println(insert)
	log.Println(update)
	log.Println(delete_)

}