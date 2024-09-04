.PHONY: start-weaviate

start-weaviate:
	cd pokedex-engine && docker compose up -d
