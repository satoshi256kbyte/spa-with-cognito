# 画面構成兼遷移図

## テキスト説明

- (/)TOP(ログインなしでアクセス可能)
    - 画面右上の「Sign in」ボタン
    - CognitoのホステッドUIサインイン画面
- (member)Member(ログイン必須)
- (/about)About(画面上のメニューから)(ログインなしでアクセス可能)

ログイン状態だとサインインリンクなし、代わりにサインアウトリンク表示

## Mermaid画面遷移図

```mermaid
flowchart TD
    TOP["TOP (/)
    ログインなしでアクセス可能"] -->|Sign inボタン| COGNITO["Cognito
    ホステッドUI"]
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