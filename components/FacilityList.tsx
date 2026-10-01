import type { Facility } from "@/lib/data";
import { SVC_LABEL } from "@/lib/data";

// 事業所の一覧表示。公表データにある値だけを出し、無い項目は「—」にする。
// 「おすすめ」「人気」のような当サイトの評価は付けない(公表データに無いため)。

export default function FacilityList({ items, limit }: { items: Facility[]; limit?: number }) {
  const list = limit ? items.slice(0, limit) : items;
  if (list.length === 0) {
    return <p className="mt-3 rounded-lg border border-[var(--line)] bg-white p-4 text-sm">該当する事業所は、公表データの範囲では見つかりませんでした。</p>;
  }
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--accent-soft)] text-left">
            <th className="border-b border-[var(--line)] px-3 py-2">事業所</th>
            <th className="border-b border-[var(--line)] px-3 py-2 whitespace-nowrap">種別</th>
            <th className="border-b border-[var(--line)] px-3 py-2 whitespace-nowrap">平日</th>
            <th className="border-b border-[var(--line)] px-3 py-2 whitespace-nowrap">土曜</th>
            <th className="border-b border-[var(--line)] px-3 py-2 whitespace-nowrap">定休日</th>
            <th className="border-b border-[var(--line)] px-3 py-2 whitespace-nowrap">定員</th>
          </tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.id + f.name} className="border-b border-[var(--line)] align-top">
              <td className="px-3 py-2">
                <p className="font-bold">{f.name}</p>
                <p className="text-xs text-[var(--ink-soft)]">
                  {f.city}
                  {f.addr}
                  {f.tel && <> ／ {f.tel}</>}
                </p>
                {f.url && (
                  <p className="text-xs">
                    <a href={f.url} target="_blank" rel="nofollow noopener noreferrer" className="link">公式サイト</a>
                  </p>
                )}
              </td>
              <td className="px-3 py-2 text-xs whitespace-nowrap">{SVC_LABEL[f.svc]}</td>
              <td className="px-3 py-2 whitespace-nowrap">{f.wd || "—"}</td>
              <td className="px-3 py-2 whitespace-nowrap">{f.sat || "—"}</td>
              <td className="px-3 py-2 text-xs">{f.off || "—"}</td>
              <td className="px-3 py-2 whitespace-nowrap">{f.cap ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {limit && items.length > limit && (
        <p className="mt-2 text-xs text-[var(--ink-soft)]">ほか{(items.length - limit).toLocaleString()}事業所</p>
      )}
    </div>
  );
}
