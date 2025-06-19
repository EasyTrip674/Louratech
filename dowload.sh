pg_dump "postgres://4d153864d5dbbc06b0195f56bb2617bb643b706e318a9639bf80ac2b69b83d6d:sk_J8DtgdGedGrxcjpSPGBDd@db.prisma.io:5432/?sslmode=require" -f backup.sql
pg_dump --no-owner --no-acl  "postgres://4d153864d5dbbc06b0195f56bb2617bb643b706e318a9639bf80ac2b69b83d6d:sk_J8DtgdGedGrxcjpSPGBDd@db.prisma.io:5432/?sslmode=require" -f backup_clean.sql
pg_dump --data-only --no-owner --no-acl  "postgres://4d153864d5dbbc06b0195f56bb2617bb643b706e318a9639bf80ac2b69b83d6d:sk_J8DtgdGedGrxcjpSPGBDd@db.prisma.io:5432/?sslmode=require" -f data_only.sql


# pour envoyer dans la base neon 
psql "postgresql://Production_owner:npg_PgVuO9m4fqYh@ep-long-lake-a99eer04-pooler.gwc.azure.neon.tech/Production?sslmode=require" -f backup.sql
psql "postgresql://Production_owner:npg_PgVuO9m4fqYh@ep-long-lake-a99eer04-pooler.gwc.azure.neon.tech/Production?sslmode=require" -f data_only.sql