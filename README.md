# profile

- profile site
  - <https://suwa-sh.github.io/profile>

## source

- [Google Sheets: works](https://docs.google.com/spreadsheets/d/1TCUUjduPYQPXYOAyAwVqX9xT7JbJcU8JebFxEfas6Fo/edit?gid=530942456#gid=530942456)
- [Looker Studio: dashboard contents](https://lookerstudio.google.com/reporting/dadde153-a36d-4ba8-bd06-497b1e7dbd91)

## development

```sh
npm install
npm run start
```

## deploy

```sh
npm run build
rm -fr ./docs/
mv ./dist/ ./docs/

git add .
git commit -m "chore: publish"
git push origin
```
