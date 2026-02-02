.PHONY: db data

db:
	npm run db:container:remove && npm run db:container:create && npm run db:migrate:init && npm run db:seed
data:
	npm run data:create:cities && npm run data:create:sites && npm run data:create:calls && npm run data:create:expenses && npm run data:create:revenue && npm run data:create:site-metrics