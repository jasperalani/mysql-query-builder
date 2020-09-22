<?php

class QueryBuilder {
    function select (
        array $columns, string $table, string $condition = null
    ): string {

        if(gettype($columns) === 'string'){
            $columns = [$columns];
        }

        $query = "SELECT ";
        $column_counter = 1;
        $column_max_count = sizeof($columns);

        foreach($columns as $column){
            $delimiter = $query . $column;
            $query = $column_counter !== $column_max_count
                ? $delimiter . ", "
                : $delimiter . " ";
            $column_counter++;
        }

        $query = $query . "FROM `" . $table . "`";

        if( !empty($condition) ){
            $query = $query . " WHERE " . $condition;
        }

        $query .= ";";

        return $query;
    }
}

$builder = new QueryBuilder();

$select = $builder->select(['chicken'], 'fush', '1');