# 画面構成兼遷移図

## 画面遷移図

```mermaid
flowchart TD
    TOP["TOP (/)
    ログインなしでアクセス可能"] -->|Sign inボタン| COGNITO["Amplify UI"]
    COGNITO -->|認証成功| TOP_LOGGED["TOP (/)
    ログイン済み状態"]

    TOP -->|メニュー| ABOUT["About (/about)
    ログインなしでアクセス可能"]
    TOP_LOGGED -->|メニュー| ABOUT

    TOP_LOGGED -->|メニュー| MEMBER["Member (member)
    ログイン必須"]

    TOP_LOGGED -->|Sign out| TOP

    ABOUT -->|Sign in| COGNITO
    ABOUT -->|メニュー| TOP

    MEMBER -->|メニュー| TOP_LOGGED
    MEMBER -->|メニュー| ABOUT
    MEMBER -->|Sign out| TOP

    classDef public fill:#90ee90,stroke:#333,stroke-width:2px
    classDef private fill:#ffb6c1,stroke:#333,stroke-width:2px
    classDef auth fill:#add8e6,stroke:#333,stroke-width:2px

    class TOP,ABOUT public
    class MEMBER private
    class COGNITO,TOP_LOGGED auth

## 参考URL

https://docs.aws.amazon.com/ja_jp/prescriptive-guidance/latest/patterns/authenticate-react-app-users-cognito-amplify-ui.html
```
