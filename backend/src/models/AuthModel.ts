import bcrypt from 'bcryptjs';
import connection from '../database/connection';

interface Ibody {
  id_user_pk: string,
  idUser: string,
  email: string,
  password: string,
}

class UserModel {
  public insertUser = async (body: Ibody) : Promise<Ibody> => {
    const hash = await bcrypt.hash(body.password, 10);
    await connection.raw(`
      BEGIN;
      INSERT INTO users (id_user_pk, email, password) VALUES ('${body.idUser}', '${body.email}', '${hash}');
      COMMIT;
    `);
    return this.findUser(body.email);
  };

  public findUser = async (email : string, withPassword = false) : Promise<Ibody> => {
    const { rows } = await connection.raw(
      withPassword
        ? `SELECT id_user_pk, email, password FROM users WHERE email = '${email}'`
        : `SELECT id_user_pk, email FROM users WHERE email = '${email}'`,
    );
    return rows[0];
  };
}

export default new UserModel();
