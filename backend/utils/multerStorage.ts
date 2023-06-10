import multer from "multer";
import generateDirectory from "./generateDirectory";

export const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { username } = req.params;
    const directory = `publish/users/${username}`;

    await generateDirectory(directory);

    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, "thumbnail.jpg");
  },
});

export const upload = multer({ storage });
