import weaviate from 'weaviate-ts-client';

export const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

export async function createSchema(): Promise<void> {
    const schemaConfig = {
        class: 'Pokemon',
        vectorizer: 'img2vec-neural',
        vectorIndexType: 'hnsw',
        moduleConfig: {
            'img2vec-neural': {
                imageFields: ['image'],
            },
        },
        properties: [
            { name: 'image', dataType: ['blob'] },
            { name: 'text', dataType: ['string'] },
        ],
    };
    await client.schema.classCreator().withClass(schemaConfig).do();
}

export async function deleteSchema(): Promise<void> {
    await client.schema.classDeleter().withClassName('Pokemon').do();
}
