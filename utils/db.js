import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.HOST = process.env.DB_HOST || 'localhost';
    this.PORT = process.env.DB_PORT || '27017';
    this.DB_NAME = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.HOST}:${this.PORT}`;
    this.mongoClient = new MongoClient(this.url, { useUnifiedTopology: true });

    this.mongoClient.connect().then(() => {
      this.db = this.mongoClient.db(this.DB_NAME);
    }).catch((err) => {
      console.log(err.message);
    });
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    const userCount = await users.countDocuments();

    return userCount;
  }

  async nbFiles() {
    const files = this.db.collection('files');
    const fileCount = await files.countDocuments();

    return fileCount;
  }
}

const dbClient = new DBClient();
export default dbClient;
