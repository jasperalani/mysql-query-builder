## MySQL Query Builder

Functions that values and return SQL ready to be queried.

### Languages
- Javascript
- Typescript
- Go - In progress
- PHP - In  progress

In the future:
- Python

### Functions
`select`
`insert`
`update`
`delete`

`condition.where`

### Todo

- Create test files
- Improve typescript syntax

### Usage

Javascript:

```javascript
let query = ''

queryBuilder.select(['id', 'name'], 'my_table', 'id = 6');
queryBuilder.select(['id', 'name'], 'my_table', condition.where('id', '6', '='));
// SELECT id, name FROM `my_table` WHERE id = 6;

queryBuilder.insert(['name', 'deleted'], ['Jasper', false], 'my_table');
// INSERT INTO `my_table` (name, deleted) VALUES ('Jasper', 'false');

queryBuilder.update(['name', 'deleted'], ['Yasper', true], 'id = 6', 'my_table');
// UPDATE `my_table` SET name = 'Yasper', deleted = 'true' WHERE id = 6;

queryBuilder.delete('id = 6', 'my_table');
// DELETE FROM `my_table` WHERE id = 6;

queryBuilder.select(
  '*',
  'table',
  // condtion funtion
  condition.where(['id', 'code'], ['5', 'xxyyzz'], '=')
)
// SELECT * FROM `table` WHERE id = 5 AND code = 'xxyyzz';

```

Typescript:
```typescript
const columns: Columns = {
    columns: [
        {value: 'id'},
        {value: 'name'},
        {value: 'deleted'}
    ]
}

const values: Values = {
    values: [
        {value: 6},
        {value: 'value'},
        {value: false}
    ]
}

queryBuilder.insert(columns, values, 'my_table');

queryBuilder.select(columns, 'my_table', 'id = 6');

queryBuilder.update(columns, values, 'id = 6', 'my_table');

queryBuilder.delete('id = 6', 'my_table');
```

PHP: 
```php
$builder = new QueryBuilder();

$select = $builder->select( [ 'column1', 'column2' ], 'table1', 'x = 6' );
$insert = $builder->insert( [ 'column1' ], ['value1'], 'table1' );
$update = $builder->update( [ 'column1', 'column2' ], ['value1', 'value2'], 'table1', 'x = 6' );
$delete = $builder->delete( 'table1', 'x = 6' );
```