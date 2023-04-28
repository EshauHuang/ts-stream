import chokidar from "chokidar";
import path from "path";

export default function watchMediaDirectory(mediaDir, onM3U8Added) {
  const watcher = chokidar.watch(mediaDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    depth: 1,
  });

  watcher.on("add", (filePath) => {
    const ext = path.extname(filePath);

    if (ext === ".m3u8") {
      onM3U8Added();
      watcher.close().then(() => console.log(`closed ${mediaDir} watcher`));
    }
  });
}
