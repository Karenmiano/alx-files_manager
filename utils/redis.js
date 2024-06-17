import redis from 'redis';
import util from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.redisGet = util.promisify(this.client.get).bind(this.client);
    this.redisSet = util.promisify(this.client.set).bind(this.client);
    this.redisDel = util.promisify(this.client.del).bind(this.client);

    this.client.on('error', (err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.connected || false;
  }

  async get(key) {
    const val = await this.redisGet(key);
    return val;
  }

  async set(key, val, duration) {
    await this.redisSet(key, val, 'EX', duration);
  }

  async del(key) {
    await this.redisDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
