import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const ELASTIC_CLOUD = process.env.ELASTIC_CLOUD;

let elasticsearch;

if (ELASTIC_CLOUD) {
  const ELASTIC_CLOUD_ID = process.env.ELASTIC_CLOUD_ID;
  const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME;
  const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD;

  if (!ELASTIC_CLOUD_ID || !ELASTIC_USERNAME || !ELASTIC_PASSWORD) {
    console.error(
      'Variabel lingkungan ELASTIC_CLOUD_ID, ELASTIC_USERNAME, atau ELASTIC_PASSWORD tidak ditemukan.'
    );
    process.exit(1);
  }

  elasticsearch = new Client({
    cloud: { id: ELASTIC_CLOUD_ID },
    auth: {
      username: ELASTIC_USERNAME,
      password: ELASTIC_PASSWORD,
    },
  });
} else {
  // Konfigurasi Elasticsearch Lokal
  const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST || 'localhost';
  const ELASTICSEARCH_PORT = process.env.ELASTICSEARCH_PORT || 9200;

  elasticsearch = new Client({
    node: `${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`,
  });
}

async function checkElasticsearchConnection() {
  try {
    const health = await elasticsearch.cluster.health({});
    console.log('Elasticsearch connection successful:', health);
  } catch (error) {
    console.error('Error connecting to Elasticsearch:', error);
  }
}

checkElasticsearchConnection();

export default elasticsearch;