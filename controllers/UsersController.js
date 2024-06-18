import crypto from 'crypto';
import dbClient from '../utils/db';

function hashPassword(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

export default class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (email === undefined) {
      UsersController.userCreationError(response, 'Missing email');
      return;
    }

    if (password === undefined) {
      UsersController.userCreationError(response, 'Missing password');
      return;
    }

    const users = dbClient.db.collection('users');
    const user = await users.findOne({ email });

    if (user) {
      UsersController.userCreationError(response, 'Already exist');
      return;
    }

    const hashedPassword = hashPassword(password);
    const newUser = await users.insertOne({ email, password: hashedPassword });
    response.statusCode = 201;
    response.send({
      id: newUser.insertedId,
      email,
    });
  }

  static userCreationError(response, errorMsg) {
    response.statusCode = 400;
    response.send({ error: errorMsg });
  }
}
