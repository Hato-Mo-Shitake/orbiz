# Obsidian Plugin: orbiz

ルート直下にある`orbiz`ディレクトリ以下を支配するプラグインです。

## 導入

- ターミナルで現在使用しているvaultのディレクトリに移動して、`.obsidian/plugins`を作成します。

```
cd path/to/vault
mkdir .obsidian/plugins
```

次に、`.obsidian/plugins`のディレクトリに移動して、orbizのリポジトリをcloneします。

```
cd .obsidian/plugins
git clone https://github.com/Hato-Mo-Shitake/orbiz.git
```

`plugins/orbiz`に移動して、コンパイルを行うために `npm install`を実行します。

```
cd orbiz
npm install
npm run build
```

`npm run build`の代わりに`npm run dev`でコンパイルすることもできます。こちらは開発用です。

コンパイル後はObsidianのアプリを立ち上げ、コミュニティプラグインの設定を開きます。
orbizを有効にすると完了です。

## orbizについて
- orbizは、様々な情報を構造的に管理できるobsidianをさらに厳密に構造化するものです。
- orbizではメインに扱うfileを`note`と呼びます。（obsidian本来のノートとは異なります。）

### note について

- `tags`, `belongsTo`, `references` メタデータを持ちます。
- 

- また、noteは大きく`my-note`と`board-note`の二種類に分けられます。

#### my-note
my-noteはさらに以下の種類に分けられます。
- `knowledge`: 
- `creatorium`: 
- `gallery`: 
- `faq`: 

#### board-note
board-noteはさらに以下の種類に分けられます。
- `task`: 
- `schedule`: 
- `notice`: 
- `memo`: 


### その他仕様
- `orbiz/inbox/`以下に作成されたMarkdownファイルに対して、noteの規格に適応させるための設定モーダルが自動的に開きます。
- 新規ノートの作成場所に、`orbiz/inbox`を指定すると、未解決内部リンクの解決時に、上記の設定モーダルが開くので便利です。


## 備考

※こちらのプラグインは開発中です。動作の安全性は保証できません。
