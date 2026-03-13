.PHONY: data server dev

data:
	npm run data
dev:
	npm run dev
client-dev:
	npm run client:dev
server-dev:
	npm run server:dev
infra-dev:
	npm run infra:dev:up
