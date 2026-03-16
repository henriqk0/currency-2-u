## Currency2U Backend

Backend module builded using Express.js framework with, mainly.

#### Usage

First, create a .env file in this directory and populate it with the following variables, which must contain valid values:

```env
PORT=
EMAIL_USER=
GOOGLE_APP_PASSWORD=
ALLOWED_ORIGINS=
JWT_SECRET=
JWT_EXPIRES_IN=

DATABASE_URL="mongodb://mongo:27017/mybank?replicaSet=rs0" // same like this
```

Then, run at terminal, inside this folder:

```bash
docker compose up
```
