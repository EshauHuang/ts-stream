import CryptoJS from "crypto-js";

const SECRET_KEY = "testtest";

export const genStreamKey = (username) => {
  const hash = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
  const streamKey = URLSafeEncoded(hash);

  return streamKey;
};

export const URLSafeEncoded = (str) => str.replace(/\//g, "_").replace(/\+/g, "-")

export const URLSafeDecoded = (str) => str.replace(/\_/g, "\/").replace(/\-/g, "\+");

export const checkStreamKey = (streamKey) => {
  const hash = URLSafeDecoded(streamKey);

  return CryptoJS.AES.decrypt(hash, SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
