# そだちマップ（sodachi-map）

放課後等デイサービス・児童発達支援を「うちの都合で通えるか」から探せるサイト。

## このサイトの立ち位置

既存のポータル（放デイマッチ・障害者ドットコム・LITALICO発達ナビ 等）は、
送迎の有無・療育プログラム・医療的ケア・空き状況では絞り込める。
一方で **「平日の終わりが何時か」「土曜に開いているか」では絞り込めない**。

国の公表データにはこの項目が入っているのに、誰も検索軸にしていない。そこを取る。

実データで裏づけた差：放課後等デイサービスのうち

| 平日の終わり | 事業所数 | 割合 |
|---|---|---|
| 17時以降まで | 19,957 | 97% |
| 17時30分以降まで | 14,164 | 69% |
| **18時以降まで** | **7,835** | **38%** |
| 19時以降まで | 1,363 | 7% |

（平日の利用可能な時間帯を公表していた20,641事業所が母数）

## データ

出所：[障害福祉サービス等情報公表システム（WAM NET）オープンデータ](https://www.wam.go.jp/content/wamnet/pcpub/top/sfkopendata/)
2026年3月末時点。営利・非営利を問わず二次利用可。

- `sfkopendata_202603_65.zip` = 放課後等デイサービス（25,020件）
- `sfkopendata_202603_63.zip` = 児童発達支援（16,993件）

CSVの列には 利用可能な時間帯（平日/土曜/日曜/祝日）・定休日・定員・緯度経度 が含まれる。

### 更新手順

```bash
# 1) 最新のZIPを取得して展開（例: 2026年3月版）
mkdir -p /tmp/wam && cd /tmp/wam
for n in 65 63; do
  curl -sL -A 'Mozilla/5.0' -o t$n.zip \
    "https://www.wam.go.jp/content/files/pcpub/top/sfkopendata/202603/sfkopendata_202603_$n.zip"
  unzip -o -q t$n.zip
done

# 2) JSONを生成（data/ に出力）
python3 scripts/build-data.py /tmp/wam
```

元データは年2回（3月末時点・9月末時点）公表される。

### 方針

- 公表データに書かれている値だけを出す。**空欄は空欄のまま**出し、推測で埋めない
- 事業所の優劣の評価・ランキング・口コミは載せない
- 空き状況は公表データに無いので扱わない

## 開発

```bash
npm install
npm run dev
npm run build   # 静的書き出し → out/
```

## デプロイ（Cloudflare Pages）

| 項目 | 値 |
|---|---|
| Framework preset | **None**（Next.jsを選ばない） |
| Build command | `npm run build` |
| 出力ディレクトリ | `out` |
| 環境変数 | `NODE_VERSION=20` |

`npm run build` の最後で `*.txt`（RSCペイロード）を削除している。
これをしないとファイル数がCloudflare Pagesの上限20,000を超える。
