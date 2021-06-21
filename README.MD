## Whatsapp Service with Bull

A Simple whatsapp API with Bull redis based queue.
Provide API to send message text or with image in background process.

## 💻 Technologies

- [NodeJS](https://nodejs.org)
- [Bull](https://github.com/OptimalBits/bull)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)

## How to install

- clone this repository
- change .env with your enviroment
- run `npm install`
- run `npm run start` to run locally

| Endpoint                   | Description      |
| -------------------------- | ---------------- |
| `POST: /chat/sendmessage/` | Sendding message |
| `POST: /chat/sendimage`    | Sending image    |
