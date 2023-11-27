to run project add information regarding crud api in config json
then run command

node index.js

it will create file in src with separate for all modules
and add all in sql details in sql script file .

config file

- dbName - give dbName you want to give
- modules(array) - list of modules
  - module name - give first letter capital
  - table name
  - table details(array)
    - fieldName - column name in db table
    - fieldType - data type for table column

it will create module wise folder, in that folder you will find controller, model, and route files and there will be common sqlScript file
