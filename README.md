# Pokedex AI

This project is a real Pokedex implementation using Weaviate (a neural network and a vector database) to recognize the Pokemon. The frontend is a React Native app which uses a Hono server to communicate with Weaviate.

## Initial Design

![Initial Design](/design/design.png)

## Run Weaviate

To run Weaviate, you need to have Docker installed. Then, you can run the following command:

```bash
cd pokemon-engine
docker-compose up -d
```

## Run Hono

To run Hono API Server, you can run the following command:

```bash
cd pokemon-engine
bun install
bun run index.ts
```
