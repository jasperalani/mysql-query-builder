## MySQL Query Builder

Languages supported:
- Javascript

To be supported:
- Typescript
- PHP
- Go

Current functions:
`select`
`insert`
`update`
`delete`

### Usage

#### Javascript:
<code>
queryBuilder.select(['id', 'name'], 'my_table', 'id = 6');

queryBuilder.insert(['name', 'deleted'], ['Jasper', false], 'my_table');

queryBuilder.update(['name', 'deleted'], ['Yasper', true], 'id = 6', 'my_table');

queryBuilder.delete('id = 6', 'my_table');
</code>

#### Typescript:
<code>
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
</code>
