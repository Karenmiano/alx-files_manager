import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  static getStatus(request, response) {
    response.send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static getStats(request, response) {
    async function stats() {
      const userCount = await dbClient.nbUsers();
      const fileCount = await dbClient.nbFiles();

      response.send({
        users: userCount,
        files: fileCount,
      });
    }

    stats();
  }
}
