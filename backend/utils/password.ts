import bcrypt from "bcrypt";

const saltRounds = 10;

export const genSalt = () => bcrypt.genSaltSync(saltRounds);

export const hashPassword = (password: string, salt: string) => bcrypt.hashSync(password, salt);

export const checkPassword = (password: string, passwordHash: string) =>
  bcrypt.compareSync(password, passwordHash);