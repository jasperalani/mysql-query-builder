<?php

class QueryBuilder {

	function select(
		array $columns,
		string $table,
		string $condition = null
	): string {
		if ( gettype( $columns ) === 'string' ) {
			$columns = [ $columns ];
		}

		$query            = "SELECT ";
		$column_counter   = 1;
		$column_max_count = sizeof( $columns );

		foreach ( $columns as $column ) {
			$delimiter = $query . $column;
			$query     = $column_counter !== $column_max_count
				? $delimiter . ", "
				: $delimiter . " ";
			$column_counter ++;
		}

		$query = $query . "FROM `" . $table . "`";

		if ( ! empty( $condition ) ) {
			$query = $query . " WHERE " . $condition;
		}

		$query .= ";";

		return $query;
	}

	function insert(
		array $columns,
		array $values,
		string $table
	): string {
		if ( sizeof( $columns ) !== sizeof( $values ) ) {
			return "";
		}

		$query = /** @lang text */
			"INSERT INTO $table";

		$column_counter   = 1;
		$column_max_count = sizeof( $columns );

		foreach ( $columns as $column ) {
			if ( $column_counter === 1 && $column_counter === $column_max_count ) {
				$query .= " ($column) ";
			} elseif ( $column_counter === 1 ) {
				$query .= " ($column, ";
			} elseif ( $column_counter == $column_max_count ) {
				$query .= "$column) ";
			} else {
				$query .= "$column, ";
			}
			$column_counter ++;
		}

		$value_counter   = 1;
		$value_max_count = sizeof( $values );

		foreach ( $values as $value ) {
			if(
				$value !== null &&
				!is_int($value)
			) {
				$value = "'$value'";
			}
			if ( $value_counter === 1 && $value_counter === $value_max_count ) {
				$query .= "VALUES ($value);";
			} elseif ( $value_counter === 1 ) {
				$query .= "VALUES ($value, ";
			} elseif ( $value_counter === $value_max_count ) {
				$query .= "$value);";
			} else {
				$query .= "$value, ";
			}
			$value_counter ++;
		}

		return $query;
	}

	function update(
		array $columns,
		array $values,
		string $table,
		string $condition = ""
	): string {
		if ( sizeof( $columns ) !== sizeof( $values ) ) {
			return "";
		}

		$query = /** @lang text */
			"UPDATE $table SET ";

		$column_counter = 1;
		$column_max_count = sizeof($columns);
		$value_counter = 0;

		foreach($columns as $column){
			if(
				$values[$value_counter] !== null &&
				!is_int($values[$value_counter])
			) {
				$values[$value_counter] = "'{$values[$value_counter]}'";
			}

			if($column_counter === $column_max_count){
				$query .= "$column = {$values[$value_counter]}";
			}else{
				$query .= "$column = {$values[$value_counter]}, ";
			}

			$column_counter++;
			$value_counter++;
		}

		$query .= "" !== $condition ? " WHERE $condition;" : ";";

		// Todo: check this works
		return $query;
	}

	function delete(
		string $table,
		string $condition = ""
	): string {
		$query = /** @lang text */
			"DELETE FROM $table";

		return $query .= "" !== $condition ? " WHERE $condition;" : ";";
	}

}