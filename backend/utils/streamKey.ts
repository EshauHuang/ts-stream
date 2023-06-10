import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY || "testtest";

export const genStreamKey = (username: string) => {
  const hash = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
  const streamKey = URLSafeEncoded(hash);

  return streamKey;
};

export const URLSafeEncoded = (str: string) =>
  str.replace(/\//g, "_").replace(/\+/g, "-");

export const URLSafeDecoded = (str: string) =>
  str.replace(/\_/g, "/").replace(/\-/g, "+");

export const checkStreamKey = (streamKey: string) => {
  const hash = URLSafeDecoded(streamKey);
  return CryptoJS.AES.decrypt(hash, SECRET_KEY).toString(CryptoJS.enc.Utf8);
};
