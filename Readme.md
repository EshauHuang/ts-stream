# 實況平台

## 使用流程
[Demo](https://abc.redice.live/)

測試用 user

username: 123
password: 123

username: user01
password: user01

### 首頁
可在首頁看到其他人直播的存檔，並註冊及登入會員
![home-page](https://github.com/EshauHuang/ts-stream/assets/52191824/1a544369-2fef-42dc-8822-7551669aed3f)

### 設定頁面
登入會員後可設定自己的直播間資訊
![setting-page](https://github.com/EshauHuang/ts-stream/assets/52191824/fdc62279-5ed3-4470-a2a7-55c4f13c8721)

### OBS 設定
至 Settings -> Stream 設定
- Server: rtmp://a.rtmp.redice.live/live
- Stream Key: 設定頁面的 Primary Stream key
![obs-setting](https://github.com/EshauHuang/ts-stream/assets/52191824/34c492c5-ca31-4cdb-bda2-d42a817f48da)


### 直播頁面
可在直播頁面看見剛才設定的直播資訊，觀眾可以在直播期間留言與直播主互動(目前直播延遲約 30~40秒)
![live-room](https://github.com/EshauHuang/ts-stream/assets/52191824/da9ba8f1-d28a-44b2-ac30-fa4bd040fd43)

### 直播存檔
直播結束後可在首頁看到剛才的直播存檔
![stream-record](https://github.com/EshauHuang/ts-stream/assets/52191824/ecc12a64-d4ba-46b0-a941-e06549138b9b)


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

### 安裝 docker
請參考: https://docs.docker.com/engine/install

### clone 專案
```
git clone https://github.com/EshauHuang/ts-stream.git
```

### 設定 .env

#### 修改 `frontend/.env.example` -> `frontend/.env`
```
# Setting up an Nginx server to get a m3u8 file using HTTP protocol.
VITE_GET_STREAM_URL=http://localhost

# Setting up an Api server to get video or stream HLS meta using HTTP protocol.
VITE_API_SERVER_URL=http://localhost/api

# Socket IO server
VITE_SOCKET_URL=http://localhost
```

#### 修改 `bakcend/.env.example` -> `bakcend/.env`
```
# Setting up an Nginx server to push a stream using RTMP protocol.(docker network IP)
# 直播推播的 Nginx server 目前設定為此 App 的 Network IP(請見 `docker-compose.yml` 的 networks)
STREAM_SERVER_URL=rtmp://172.23.0.1

# Setting up a key with CryptoJS allows you to generate or verify stream keys.
# 欲使用測試 user 請使用此設定
SECRET_KEY=testtest

# The domain of the server, used for CORS configuration to allow access from specific origins.
# Node server 可接收的 domain
SERVER_DOMAIN=http:/localhost
```

### 建立測試 APP 或產品 APP
```
# 測試
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

## 產品
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### 開啟 [http://localhost](http://localhost)

## docker-nginx-rtmp
使用 [alfg/nginx-rtmp](https://github.com/alfg/docker-nginx-rtmp)，並稍作修改，主要作為串流的影片的輸出輸入

## nginx-reverse-proxy
用於分配至不同 docker container
