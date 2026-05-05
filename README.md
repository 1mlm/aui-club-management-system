# aui-clubs

## setup env

1. create a file named `.env` in the project root.
2. copy everything from `.env.example`.
3. fill your postgres username and password.

example local values:

```env
DB_USER=nassem
DB_PASSWORD=nassem
```

> note: assumes postgres is on localhost:5432.
> database name: aui_clubs.

Make sure you saved the file (File > Save or `Ctrl` + `S`)

4. Run this to create the database
`npm run db:reset`
- full reset.
- terminates active db connections.
- drops the target database.
- creates it again.
- applies:
	- base schema from `db/sql/create.sql`
	- seed from `db/sql/populate.sql`

All users use password `Password123!`.

5. run app

`npm run dev`
