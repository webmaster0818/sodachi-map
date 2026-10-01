# -*- coding: utf-8 -*-
"""
障害福祉サービス等情報公表システム(WAM NET)のオープンデータから、
サイトで使うJSONを生成する。

出所: https://www.wam.go.jp/content/wamnet/pcpub/top/sfkopendata/
      sfkopendata_202603_65.zip(放課後等デイサービス) / _63.zip(児童発達支援)
      2026年3月末時点・営利非営利を問わず二次利用可と明記。

方針: CSVに書かれている値だけを載せる。空欄は空欄のまま出し、推測で埋めない。
"""
import csv, io, json, os, re, sys, collections

SRC = sys.argv[1] if len(sys.argv) > 1 else "/private/tmp/claude-501/-Users-saburo-hasegawa/ee1f8c54-9b09-4170-8e18-cb1805eee44f/scratchpad/wam"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
SURVEY = "2026年3月末"

FILES = [("csvdownload065.csv", "houday", "放課後等デイサービス"),
         ("csvdownload063.csv", "jihatsu", "児童発達支援")]

def pref_of(addr):
    m = re.match(r"(.{2,3}?[都道府県])", addr or "")
    return m.group(1) if m else ""

def city_of(addr):
    return re.sub(r"^.{2,3}?[都道府県]", "", addr or "").strip()

PREF_SLUG = {
 "北海道":"hokkaido","青森県":"aomori","岩手県":"iwate","宮城県":"miyagi","秋田県":"akita","山形県":"yamagata",
 "福島県":"fukushima","茨城県":"ibaraki","栃木県":"tochigi","群馬県":"gunma","埼玉県":"saitama","千葉県":"chiba",
 "東京都":"tokyo","神奈川県":"kanagawa","新潟県":"niigata","富山県":"toyama","石川県":"ishikawa","福井県":"fukui",
 "山梨県":"yamanashi","長野県":"nagano","岐阜県":"gifu","静岡県":"shizuoka","愛知県":"aichi","三重県":"mie",
 "滋賀県":"shiga","京都府":"kyoto","大阪府":"osaka","兵庫県":"hyogo","奈良県":"nara","和歌山県":"wakayama",
 "鳥取県":"tottori","島根県":"shimane","岡山県":"okayama","広島県":"hiroshima","山口県":"yamaguchi",
 "徳島県":"tokushima","香川県":"kagawa","愛媛県":"ehime","高知県":"kochi","福岡県":"fukuoka","佐賀県":"saga",
 "長崎県":"nagasaki","熊本県":"kumamoto","大分県":"oita","宮崎県":"miyazaki","鹿児島県":"kagoshima","沖縄県":"okinawa",
}

def end_hour(t):
    """「14:00-18:00」から終了時刻(時・小数)を取る。取れなければNone。"""
    m = re.findall(r"(\d{1,2}):(\d{2})", t or "")
    if len(m) < 2:
        return None
    h, mi = int(m[-1][0]), int(m[-1][1])
    if h > 30:
        return None
    return h + mi / 60

def start_hour(t):
    m = re.findall(r"(\d{1,2}):(\d{2})", t or "")
    if not m:
        return None
    return int(m[0][0]) + int(m[0][1]) / 60

def num(s):
    m = re.search(r"\d+", s or "")
    return int(m.group(0)) if m else None

def norm_time(t):
    t = (t or "").strip()
    return t if re.search(r"\d", t) else ""

def main():
    by_pref = collections.defaultdict(list)
    counts = {}
    for fname, key, label in FILES:
        path = os.path.join(SRC, fname)
        s = open(path, "rb").read().decode("utf-8-sig")
        rows = list(csv.reader(io.StringIO(s)))
        data = rows[1:]
        counts[key] = len(data)
        for r in data:
            addr_city = r[15] or ""
            pref = pref_of(addr_city)
            if pref not in PREF_SLUG:
                continue
            weekday = norm_time(r[22])
            e = {
                "id": r[14] or r[1],           # 事業所番号
                "svc": key,
                "name": r[12],
                "corp": r[3],
                "city": city_of(addr_city),
                "addr": (r[16] or "").strip(),
                "tel": (r[17] or "").strip(),
                "url": (r[19] or "").strip(),
                "lat": (r[20] or "").strip(),
                "lng": (r[21] or "").strip(),
                "wd": weekday,
                "sat": norm_time(r[23]),
                "sun": norm_time(r[24]),
                "hol": norm_time(r[25]),
                "off": (r[26] or "").strip(),
                "memo": (r[27] or "").strip(),
                "cap": num(r[28]),
            }
            e["end"] = end_hour(weekday)
            e["start"] = start_hour(weekday)
            by_pref[pref].append(e)

    os.makedirs(OUT, exist_ok=True)
    index = []
    for pref, items in sorted(by_pref.items(), key=lambda x: list(PREF_SLUG).index(x[0])):
        slug = PREF_SLUG[pref]
        items.sort(key=lambda e: (e["city"], e["name"]))
        with open(os.path.join(OUT, f"pref-{slug}.json"), "w", encoding="utf-8") as f:
            json.dump({"pref": pref, "slug": slug, "surveyedAt": SURVEY, "items": items}, f, ensure_ascii=False)
        cities = collections.Counter(e["city"] for e in items)
        index.append({
            "pref": pref, "slug": slug,
            "total": len(items),
            "houday": sum(1 for e in items if e["svc"] == "houday"),
            "jihatsu": sum(1 for e in items if e["svc"] == "jihatsu"),
            "sat": sum(1 for e in items if e["sat"]),
            "late18": sum(1 for e in items if e["end"] and e["end"] >= 18),
            "cities": len(cities),
        })
    with open(os.path.join(OUT, "index.json"), "w", encoding="utf-8") as f:
        json.dump({"surveyedAt": SURVEY, "source": "障害福祉サービス等情報公表システム（WAM NET）オープンデータ",
                   "sourceUrl": "https://www.wam.go.jp/content/wamnet/pcpub/top/sfkopendata/",
                   "counts": counts, "prefs": index}, f, ensure_ascii=False, indent=1)
    tot = sum(p["total"] for p in index)
    print("prefs", len(index), "total", tot, "counts", counts)
    print("土曜あり", sum(p["sat"] for p in index), "18時以降", sum(p["late18"] for p in index))

if __name__ == "__main__":
    main()
