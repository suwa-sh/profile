# profile

職務経歴を公開しているprofile siteです。

## アーキテクチャ


- C4 システムコンテキスト図
  - ![image](./images/system-context.drawio.png)
- C4 コンテナ図
  - ![image](./images/container.drawio.png)

## デプロイ

- ![image](./images/deploy.drawio.png)

| 名前 | リンク |
| --- | --- |
| profile site | <https://suwa-sh.github.io/profile> |
| project dashboard | [Looker Studio](https://lookerstudio.google.com/reporting/dadde153-a36d-4ba8-bd06-497b1e7dbd91) |
| 職務経歴 | [Spreadheet](https://docs.google.com/spreadsheets/d/1TCUUjduPYQPXYOAyAwVqX9xT7JbJcU8JebFxEfas6Fo/edit?gid=530942456#gid=530942456) |

## 開発

- frontend
  - deps

    ```sh
    npm install
    ```

  - preview

    ```sh
    npm run start
    ```

  - deploy
    - main pushed -> GitHub Actions -> GitHub Pages

  - 依存の固定 (`package.json` の `overrides`)
    - `js-yaml`: 脆弱性修正版は 4.3.1 だが、astro / @astrojs/internal-helpers が `^4.1.1` を要求する transitive 依存のため Dependabot が更新経路を作れない (`security_update_not_possible`)。`overrides` で `^4.3.1` を強制し、`package-lock.json` を 4.3.1 に固定している。
    - 変更後は `npm ci && npm run build` と `npm ls js-yaml` で解決バージョンを確認する。

- 職務経歴 Spreadsheet
  - 集計
    - `【職務経歴】メニュー > rebuild marts`
