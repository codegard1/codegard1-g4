---
title: "SQL Notes"
tags: ["sql","snippets"]
published: true
date: "2019-10-05"
---

This is a page of notes around (MS)SQL syntax. 

# Useful Syntax

### LEFT([column], `Number`)
Get the specified number of characters from the left side of a text column

### RIGHT([column], `Number`)
Get the specified number of characters from the right side of a text column

### LTRIM( )
Trim space from the left side of a string

### RTRIM( )
Trim space from the right side of a string

### ISNULL( `col`, `alternateValue` )
Use when you want to supply a "default" value instead of `NULL` 

### (CASE WHEN `condition` THEN `value` ELSE `value` END)
Ternary statement, like an IF ... THEN ... ELSE statement in other languages

### [column] > ''
Returns `TRUE` when a text column contains more than 0 characters
  - This is not the same as `IS NOT NULL`, because a 0-length text string is also not `NULL`

### CAST [column] AS INT/VARCHAR(255)
Change the data type of a column when selecting 

### SELECT GETDATE()
Get the current date and time

### DELCARE @variable [type]
Delcare a varialbe as a certain data type

### SET @variable = value
Set the variable to the specified value. Duh!



# SQL Time Zones
- SQL Often uses UTC time internally when storing dates. As a result, you may need to account for time zones when selecting or inserting rows.

## Get System time zones
   ```sql
   SELECT [name],[current_utc_offset],[is_currently_dst] FROM sys.time_zone_info
   ```

## Convert a datetime value to a specific timezone
   ```sql
   SELECT CONVERT(datetime'2019-04-23T00:00:00', 126) AT TIME ZONE 'Eastern Standard Time'
   -- Output: 2019-04-23 00:00:00.0000000 -04:00
   ```

   ```sql
   -- Select datetime from UTC column and convert to EST 
   SELECT [DateColUTC] FROM [Table1]
   AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time' 
   AS [DateColEST]
   ```
   
   ```sql
   -- Convert UTC to EST when filtering rows
   SELECT * FROM [Table1] 
   WHERE [DateTimeCol] = 
    SELECT (
        CONVERT(datetime, '2018-10-17 00:21:20.000')
        AT TIME ZONE 'Eastern Standard Time' 
        AT TIME ZONE 'UTC'
    )
   ```

# Insert Rows to an SQL Table
- The syntax for inserting rows is simple but cumbersome to arrange manually. The important thing to remember is that you must insert data in the **same order as the columns are named**.

    ```sql
    INSERT INTO [dbo].[Table1]
    (
        [Column1], [Column2], [Colum3]
    )
    VALUES
    ('ColumnValue1','ColumnValue2','ColumnValue3'), -- Row 1 data
    ('ColumnValue1','ColumnValue2','ColumnValue3'), -- Row 2 data
    ('ColumnValue1','ColumnValue2','ColumnValue3') -- Row 3 data, etc.
    GO
    ```

# Create an Index for a Table
- "An index is an on-disk structure associated with a table or view that speeds retrieval of rows from the table or view. An index contains keys built from one or more columns in the table or view. These keys are stored in a structure (B-tree) that enables SQL Server to find the row or rows associated with the key values quickly and efficiently."
- **Clustered** indexes sort and store the data rows in the table or view based on their key values. These are the columns included in the index definition. There can be only one clustered index per table, because the data rows themselves can be stored in only one order.  The only time the data rows in a table are stored in sorted order is when the table contains a clustered index. When a table has a clustered index, the table is called a clustered table. If a table has no clustered index, its data rows are stored in an unordered structure called a heap.
- **Nonclustered** indexes have a structure separate from the data rows. A nonclustered index contains the nonclustered index key values and each key value entry has a pointer to the data row that contains the key value. The pointer from an index row in a nonclustered index to a data row is called a row locator. The structure of the row locator depends on whether the data pages are stored in a heap or a clustered table. For a heap, a row locator is a pointer to the row. For a clustered table, the row locator is the clustered index key. You can add nonkey columns to the leaf level of the nonclustered index to by-pass existing index key limits, and execute fully covered, indexed, queries. For more information, see Create Indexes with Included Columns. For details about index key limits see Maximum Capacity Specifications for SQL Server.
- Both clustered and non-clustered indexes can also be `UNIQUE`

## Create a non-clustered index on a single column (basic)
   ```sql
   CREATE INDEX i1 ON [Table1] (Column1)
   ```

## Create a Clustered Index on two columns
   ```sql
   CREATE CLUSTERED INDEX i2 ON [Table1]
   (Col1 DESC, Col2 ASC)
   ```

## Create a Unique Index on Three Columns
   ```sql
   CREATE UNIQUE INDEX i3 ON [Table1]
   (Col1 DESC, Col2 ASC, Col3 ASC)
   ```

# SQL Performance Tips

- Always prefix object names with the Owner/Schema names. Otherwise SQL looks in _all_ schemas for the object, which wastes time. 

- Do not use the `*` operator. Instead, always use column names. Otherwise, SQL has to spend time looking up column names one by one. 

- Do not name stored procedures `SP_<name>`. The `SP_` prefix makes SQL think the procedure is in the System Table, so it will look there first.

- _Do_ use `SET NOCOUNT ON` with DML operations (e.g. `INSERT`, `SELECT`, `DELETE`, `UPDATE`). Not counting the number of rows affected speeds up complex queries. 

- Avoid `DISTINCT`, `GROUP BY`, and `ORDER BY` whenever possible, as these operations add a lot of extra work for SQL to do. 

# Using Parameters
Parameters are like variables that allow a query to be used programmatically, i.e. in stored procedures. 

To use parameters in a query, first `DECLARE` them with a type, then `SET` the variable value. Finally, use the parameter in your CRUD statements e.g.

```sql
DECLARE @Title NVARCHAR(255)

SET @Title = 'Chris'

INSERT INTO [dbo].[NameTable]
( [Title] )
VALUES
( @Title )
GO

SELECT TOP 10 
[Title]
FROM [dbo].[NameTable]
WHERE [Title] = @Title
```


# Move User Databases
To move a data or log file as part of a planned relocation, follow these steps:

1. Set the target database to OFFLINE

   ```sql
   ALTER DATABASE database_name SET OFFLINE;  
   ```

1. Move the database file or files to the new location. For each file moved, run the following statement.

   ```sql
   ALTER DATABASE database_name MODIFY FILE ( NAME = logical_name, FILENAME = 
   'new_path\os_file_name' );  
   ```

1. ALTER the database to use the new file path

   ```sql
   ALTER DATABASE database_name SET ONLINE;  
   ```

1. Verify the file change by running the following query.

   ```  sql
   SELECT name, physical_name AS CurrentLocation, state_desc  
   FROM sys.master_files  
   WHERE database_id = DB_ID(N'<database_name>');  
   ```  


# Use CURSOR to read a result set row by row 
A CURSOR is like an enumerator for a result set returned by a SELECT statement. This allows you to perform actions on each row of a result set one at a time. 

```sql
-- Declare the variable
DECLARE @cutoff datetime;

-- Declare the cursor as the result of a SELECT statement
DECLARE cursor_cutoff CURSOR
FOR SELECT
    TOP 10
    [Date_Time]
FROM [dbo].[Pageviews]
ORDER BY [Date_Time] DESC;

-- Open the cursor for reading
OPEN cursor_cutoff;

-- Perform the first fetch and store the values in variables.  
-- Note: The variables are in the same order as the columns  
-- in the SELECT statement.   
FETCH NEXT FROM cursor_cutoff INTO @cutoff;

-- Check @@FETCH_STATUS to see if there are any more rows to fetch.
WHILE @@FETCH_STATUS = 0  
BEGIN  

   -- Do stuff with the result here
   PRINT @cutoff

   -- This is executed as long as the previous fetch succeeds.  
   FETCH NEXT FROM contact_cursor INTO @cutoff
END  

-- Close the cursor and deallocate it from memory
CLOSE contact_cursor;  
DEALLOCATE contact_cursor;

GO
```
([Source](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/set-local-variable-transact-sql?view=sql-server-2017))