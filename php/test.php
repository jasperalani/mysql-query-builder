<?php

require_once 'query-builder.php';

$builder = new QueryBuilder();

$select = $builder->select( [ 'column1', 'column2' ], 'table1', 'x = 6' );
$insert = $builder->insert( [ 'column1' ], ['value1'], 'table1' );
$update = $builder->update( [ 'column1', 'column2' ], ['value1', 'value2'], 'table1', 'x = 6' );
$delete = $builder->delete( 'table1', 'x = 6' );

echo("Select: $select\nInsert: $insert\nUpdate: $update\nDelete: $delete\n");

/* Output:

Select: SELECT column1, column2 FROM `table1` WHERE x = 6;
Insert: INSERT INTO table1 (column1) VALUES ('value1');
Update: UPDATE table1 SET column1 = 'value1', column2 = 'value2' WHERE x = 6;
Delete: DELETE FROM table1 WHERE x = 6;

 */