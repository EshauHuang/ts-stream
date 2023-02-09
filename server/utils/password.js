import bcrypt from "bcrypt";

const saltRounds = 10;

export const genSalt = () => bcrypt.genSaltSync(saltRounds);

export const hashPassword = (password, salt) => bcrypt.hashSync(password, salt);

export const checkPassword = (password, passwordHash) =>
  bcrypt.compareSync(password, passwordHash);