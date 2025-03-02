import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST ?? 'localhost';
const ELASTICSEARCH_PORT = process.env.ELASTICSEARCH_PORT ?? 9200;

const elasticUrl = `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`;

const elasticsearch = new Client({
  node: elasticUrl,
});

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