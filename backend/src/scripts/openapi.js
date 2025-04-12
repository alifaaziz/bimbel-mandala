import { z } from 'zod';
import { transpile } from 'postman2openapi';
import { writeFile } from 'fs/promises';
import { appEnv } from '../utils/env.js'; // Import appEnv dari env.js

async function main() {
  const { POSTMAN_API_KEY, POSTMAN_COLLECTION_ID } = appEnv; // Ambil variabel dari appEnv

  const postmanCollectionResponse = await fetch(
    `https://api.getpostman.com/collections/${POSTMAN_COLLECTION_ID}`,
    {
      headers: {
        'x-api-key': POSTMAN_API_KEY
      }
    }
  );

  if (!postmanCollectionResponse.ok) {
    throw new Error(
      `Failed to fetch Postman collection: ${postmanCollectionResponse.statusText}`
    );
  }

  /**
   * @typedef {{
   *   collection: {
   *     info: Record<string, unknown>;
   *     item: Record<string, unknown>[];
   *   };
   * }} PostmanCollection
   */

  /** @type {PostmanCollection} */
  const { collection } = await postmanCollectionResponse.json();

  const openapi = transpile(collection);

  openapi.servers = [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ];

  const stringifiedOpenapi = JSON.stringify(openapi, null, 2);

  await writeFile('./src/docs/openapi.json', stringifiedOpenapi);

  console.log('OpenAPI file has been generated successfully.');
}

void main();