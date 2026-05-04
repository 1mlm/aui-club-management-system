# aui-clubs

this project uses postgres with pg only.
no prisma. no drizzle.

## setup env

1. create a file named `.env` in the project root.
2. copy everything from `.env.example`.
3. fill your postgres username and password.

example local values:

```env
DB_USER=lmalik
DB_PASSWORD=lmalik
```

note: assumes postgres is on localhost:5432.
database name: aui_clubs.

## db scripts

`npm run db:test`
- checks if postgres connection works.

`npm run db:reset`
- full reset.
- terminates active db connections.
- drops the target database.
- creates it again.
- applies:
	- base schema from `db/sql/create.sql`
	- seed from `db/sql/populate.sql`

`npm run db:seed`
- reapplies only the seed file.

seeded users use `Password123!`.

## run app

`npm run dev`
