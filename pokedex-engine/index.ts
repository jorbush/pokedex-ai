import { Hono } from 'hono';
import {
    initSchema,
    returnPokedexEntryFromImageBase64,
    trainAllPokedex,
} from './src/engine';

const app = new Hono();

app.get('/', (c) => {
    return c.json({ message: 'Hello Bun!' });
});

app.post('/pokedex', async (c) => {
    const { image } = await c.req.parseBody();
    const data = await returnPokedexEntryFromImageBase64(image.toString());
    return c.json({ data });
});

console.log('Initializing Pokedex Engine...');
await initSchema();
await trainAllPokedex();
console.log('Pokedex Engine initialized!');

const port = parseInt(process.env.PORT!) || 3000;
console.log(`Running at http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
