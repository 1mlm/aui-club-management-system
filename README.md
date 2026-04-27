# aui-clubs

this project uses postgres with pg only.
no prisma. no drizzle.

## setup env

1. create a file named `.env` in the project root.
2. copy everything from `.env.example`.
3. fill your postgres username, password, and database name.

example local values:

```env
DB_USER=lmalik
DB_PASSWORD=lmalik
DB_NAME=aui-clubs
```

if you want a different database name, change `DB_NAME`.
default (if you don't write anything after the = ) is `aui-clubs`.

note: assumes postgres is on localhost:5432.

## db scripts

`npm run db:test`
- checks if postgres connection works.

`npm run db:reset`
- full reset.
- terminates active db connections.
- drops the target database.
- creates it again.
- applies:
	- base schema from `db/create.sql`
	- app constraints from `db/query.sql`
	- seed from `db/populate.sql`

`npm run db:seed`
- reapplies only the seed file.

## run app

`npm run dev`
