import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';

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