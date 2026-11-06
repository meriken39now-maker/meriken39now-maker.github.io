# はゆわらのTRPGプロフ

このページの内容は、フォルダの中のテキストファイルと画像を変更すると更新されます。
このフォルダは公開リポジトリなので、**入れたファイルはすべて誰でも見られます**。

| 変えたいもの | 編集するファイル |
|---|---|
| カレンダー | `calendar.txt` |
| 共通ハウスルール | `rules/common.txt` |
| システム別ハウスルール | `rules/CoC6.txt`・`rules/CoC7.txt`・`rules/emoklore.txt` |
| キャラクターの一覧 | `characters/list.txt` |
| キャラクターの中身 | `characters/(フォルダ名)/profile.txt` |
| キャラクターの画像 | `characters/(フォルダ名)/icon.png`・`stand1.png`・`stand2.png`… |
| 通過シナリオ・回せるシナリオ・所持サプリ・おててつないでいるもの | `index.html` の `DATA` |

書き方は、各テキストファイルの `#` から始まるメモ行に書いてあります。

## キャラクターを追加する手順

1. `characters` の中に新しいフォルダを作る（例: `characters/yuki`）。フォルダ名は半角英数字と `-` `_` だけ
2. ほかのキャラの `profile.txt` をコピーして、中身を書き換える
3. 画像を同じフォルダに入れる
   - `icon.png` … 一覧用（正方形）
   - `stand1.png`, `stand2.png` … 立ち絵（`profile.txt` の「立ち絵:」に書いた数だけ）
   - 拡張子は png / jpg / jpeg / webp / gif のどれでもOK
4. `characters/list.txt` の一番下にフォルダ名を書き足す

## 公開ページに反映する

GitHub Desktop で「Commit to main」→「Push origin」すると、数分で公開ページに反映されます。

## 公開前の注意

- 写真から作った画像には、撮影場所（位置情報）が入っていることがあります。公開前に消しておくと安心です
- `index.html` をダブルクリックで直接開くと、テキストファイルを読み込めないため中身が表示されません。公開ページで確認してください
