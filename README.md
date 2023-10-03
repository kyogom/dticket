# dticket

個人開発サービス DiscordTicket のコード

## Backend

### Debug

(初回のみ) `yarn global add prisma`
`yarn dev`
`yarn prisma migrate reset`

### Test

`yarn test`
`yarn test:e2e`

### Deploy

(初回のみ) `heroku git:remote -a discordticket`  
`git subtree push --prefix backend/ heroku main`

```
(force push したいとき)
git push heroku `git subtree split --prefix backend/ main`:main --force
```

`yarn prisma migrate dev`

## Frontend

### Debug

`pnpm dev`

### Deploy

Vercel で自動デプロイ
