.PHONY: data server dev

data:
	npm run data
dev:
	npm run dev
infra:
	npm run infra:up
build:
	npm run build
start:
	npm run start
deploy:
	npm run deploy

server-dev:
	npm run start:server
infra-dev:
	npm run infra:dev:up
