.PHONY: start-weaviate start-engine

start-weaviate:
	cd pokedex-engine && docker compose up -d

start-engine:
	cd pokedex-engine && docker compose up -d && bun install && bun run index.ts
