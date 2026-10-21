import type { Facility } from "@/lib/data";
import { SVC_LABEL } from "@/lib/data";

// 事業所の一覧表示。公表データにある値だけを出し、無い項目は「—」にする。
// 「おすすめ」「人気」のような当サイトの評価は付けない(公表データに無いため)。
//
// 2026-10-21 施主指示「業者紹介する際は必ず画像をバランス良く配置」により表からカードに変更。
// 事業所の写真は著作権と子どもの写り込みの問題があるため使わず、サービス種別ごとに
// 当サイトで作成したイメージ画像(人物なし)を置く。写真を掲載できる事業所が出たら photo を差し替える。

const PHOTO: Record<Facility["svc"], { src: string; alt: string }> = {
  houday: { src: "/img/fac-houkago", alt: "放課後等デイサービスの室内のイメージ(当サイトで作成した画像)" },
  jihatsu: { src: "/img/fac-jihatsu", alt: "児童発達支援の室内のイメージ(当サイトで作成した画像)" },
};

export default function FacilityList({ items, limit }: { items: Facility[]; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items;
  if (list.length === 0) {
    return <p className="mt-3 rounded-lg border border-[var(--line-strong)] bg-white p-4 text-sm">該当する事業所は、公表データの範囲では見つかりませんでした。</p>;
  }
  return (
    <div className="mt-4">
      <ul className="grid gap-3">
        {list.map((f) => {
          const ph = PHOTO[f.svc];
          const late = f.end !== null && f.end >= 18;
          return (
            <li key={f.id + f.name} className="sm-fac">
              <figure className="sm-fac-photo">
                <picture>
                  <source srcSet={`${ph.src}.webp`} type="image/webp" />
                  <img src={`${ph.src}.jpg`} alt={ph.alt} loading="lazy" width={168} height={126} />
                </picture>
                <figcaption>イメージ</figcaption>
              </figure>
              <div className="min-w-0">
                <p className="jm-tag jm-tag-on">{SVC_LABEL[f.svc]}</p>
                <p className="sm-fac-name mt-1">{f.name}</p>
                <p className="sm-fac-meta">
                  {f.city}
                  {f.addr}
                  {f.tel && <> ／ {f.tel}</>}
                </p>
                <dl className="sm-fac-grid">
                  <div className={`sm-fac-cell${late ? " is-on" : ""}`}>
                    <dt>平日</dt>
                    <dd>{f.wd || "—"}</dd>
                  </div>
                  <div className={`sm-fac-cell${f.sat ? " is-on" : ""}`}>
                    <dt>土曜</dt>
                    <dd>{f.sat || "—"}</dd>
                  </div>
                  <div className="sm-fac-cell">
                    <dt>定休日</dt>
                    <dd>{f.off || "—"}</dd>
                  </div>
                  <div className="sm-fac-cell">
                    <dt>定員</dt>
                    <dd>{f.cap != null ? `${f.cap}名` : "—"}</dd>
                  </div>
                </dl>
                {f.url && (
                  <div className="sm-fac-actions">
                    <a href={f.url} target="_blank" rel="nofollow noopener noreferrer" className="sm-mini-btn">公式サイトを見る</a>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {limit && items.length > limit && (
        <p className="mt-2 text-xs text-[var(--ink-soft)]">ほか{(items.length - limit).toLocaleString()}事業所</p>
      )}
    </div>
  );
}
