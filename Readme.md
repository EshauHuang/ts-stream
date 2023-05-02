# 實況平台

## 目前功能
- 使用者註冊後可以直播
- 使用者可以在直播中留言
- 使用者可以觀看直播存檔

## 使用技術
- 使用 Socket.IO 建立直播間聊天室
- 使用 Docker 進行部屬
- 使用 Hls.js 播放直播及影片
- 使用 alfg/nginx-rtmp 建立 rtmp server
- 其他技術: React, TypeScript, Styled-Component, Express

## 如何部屬

### clone 專案
```
git clone https://github.com/EshauHuang/ts-stream.git
```

### 安裝 docker
請參考: https://docs.docker.com/engine/install

### 設定 .env

#### `frontend/.env`
```
// 依照 container 執行位置設定
VITE_GET_STREAM_URL=http://localhost:3535
VITE_API_SERVER_URL=http://localhost:8080
```

#### `bakcend/.env`
```
// 依照 Docker Host IP 位置設定
STREAM_SERVER_URL=rtmp://172.17.0.1:1935
// For streamKey
SECRET_KEY=...
```

### `docker compose build`

### `docker compose up -d`

### 開啟 [http://localhost:3000](http://localhost:3000)

## docker-nginx-rtmp
使用 [alfg/nginx-rtmp](https://github.com/alfg/docker-nginx-rtmp)，並稍作修改，主要作為串流的影片的輸出輸入
