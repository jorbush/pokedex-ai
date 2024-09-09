# Pokedex AI

This project is a real Pokedex implementation using Weaviate (a neural network and a vector database) to recognize the Pokemon. The frontend is a React Native app which uses a Hono server to communicate with Weaviate.

## Initial Design

![Initial Design](/design/design.png)

## Pokemon Engine

```bash
cd pokemon-engine
```

### Install dependencies

```bash
bun install
```

### Run Weaviate

To run Weaviate, you need to have Docker installed. Then, you can run the following command:

```bash
docker-compose up -d
```

### Run Hono

To run Hono API Server, you can run the following command:

```bash
bun start
```

### Format code

```bash
bun format
```

### Linter

```bash
npx oxlint
```
