# Pokedex Engine

### Install dependencies

```bash
bun install
```

### Run Weaviate

To run Weaviate, you need to have Docker installed. Then, you can run the following command:

```bash
docker-compose up -d
```

### Run server

To run Hono API Server, you can run the following command:

```bash
bun start
```

### Testing

#### Run unit tests

```bash
bun test
```

#### Test Pokedex Engine

To test Weaviate, you can run the following command:

```bash
bun run tests/quick-engine-test.ts
```

#### Test Pokedex Engine Hono Server

##### Using Postman

You can make a POST request to `http://localhost:3000/pokedex` with the following body:

```json
{
  "image": "[your_image_base64]"
}
```

> [!NOTE]
> Replace `[your_image_base64]` with the base64 of the image you want to test.

You should have something like this:

![Postman](/docs/postman.png)

##### Using curl

To test Hono API Server, you can run the following command while the server is running:

```bash
curl -X POST http://localhost:3000/pokedex \
  -H "Content-Type: application/json" \
  -d '{"image": "[your_image_base64]"}'
```

> [!NOTE]
> Replace `[your_image_base64]` with the base64 of the image you want to test.

### Format code

```bash
bun format
```

### Linter

```bash
npx oxlint
```
