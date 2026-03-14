.PHONY: data server dev

data:
	npm run data
dev:
	npm run dev
client-dev:
	npm run frontend:dev
server-dev:
	npm run backend:dev
infra-dev:
	npm run infra:dev:up
