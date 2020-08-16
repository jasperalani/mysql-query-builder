## MySQL Query Builder

Languages supported:
- Javascript
- Typescript

To be supported:
- PHP
- Go

Current functions:
`select`
`insert`
`update`
`delete`

Functions return valid SQL.

### Usage

#### Javascript:

```javascript
queryBuilder.select(['id', 'name'], 'my_table', 'id = 6');

queryBuilder.insert(['name', 'deleted'], ['Jasper', false], 'my_table');

queryBuilder.update(['name', 'deleted'], ['Yasper', true], 'id = 6', 'my_table');

queryBuilder.delete('id = 6', 'my_table');
```

#### Typescript:
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
