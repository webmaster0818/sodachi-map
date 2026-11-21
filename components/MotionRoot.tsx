'use client'

import { useEffect } from 'react'

/*
 * 全ページのスクロール出現アニメ（2026-11-21 施主 mi26rock「各ページアニメーションを設定してください」）。
 * pet-funeral-navi で事故を2回直した実装をそのまま移植している（feedback_scroll_animation_safety）。
 *
 * 守っていること:
 *  - 「非表示」の初期状態は JavaScript が付ける。JSが動かない環境では最初から全部見えている
 *  - 動かすのは transform と opacity だけ。レイアウトは1pxも動かさない
 *  - prefers-reduced-motion: reduce では何もしない（CSS側でも無効化している）
 *
 * 使い方: 出したい要素に data-rv を付ける。
 *   同じ並びを順に灯す場合は親に data-rv-group を付けると、子に70msずつ遅延が入る（最大8枚）。
 */
export default function MotionRoot() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    // ヒーロー写真のゆっくり寄り（8秒で1.06→1.00、繰り返さない）
    const hero = document.querySelector<HTMLElement>('.sm-hero')
    if (hero && !reduce.matches) {
      requestAnimationFrame(() => hero.setAttribute('data-hero', 'in'))
    }

    if (reduce.matches) return

    // 全ページで自動で拾う（data-rv を手で付けたページがあればそちらを優先する）。
    // 下層は main > header + 大きな section 1枚、という平たい作りなので、
    // section だけだと1つも動かない。見出しとカードの塊まで対象に広げる。
    let items = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'))
    if (!items.length) {
      // <main> を持たないページ（/about/ など）もあるので body に落とす
      const main = document.querySelector('main') ?? document.body
      const cand = new Set<HTMLElement>()
      // 放デイさがしの下層は section を使わず、main 直下に見出し・表・FAQ を並べる作りなので、
      // main の直下の塊と表・FAQ も対象にする（/area/・/saturday/ で対象が0だった）
      main.querySelectorAll<HTMLElement>('section, article, h2, table, details').forEach((e) => cand.add(e))
      if (main.tagName === 'MAIN') Array.from(main.children).forEach((e) => cand.add(e as HTMLElement))
      // 一覧の各カードは順に灯したいので、グリッドの直下の子を対象にする
      main.querySelectorAll<HTMLElement>('[class*="grid"]').forEach((g) => {
        if (g.children.length > 1 && g.children.length <= 24) {
          g.setAttribute('data-rv-group', '')
          Array.from(g.children).forEach((c) => cand.add(c as HTMLElement))
        }
      })
      // 祖先が対象なら子を外す、という絞り方にすると、下層のように
      // 「大きな section 1枚の中に全部入っている」ページで対象がゼロになる。
      // 入れ子のまま出しても見た目の破綻はないので、絞らずに使う。
      items = Array.from(cand)
        // ファーストビューに最初から見えている塊は動かさない
        .filter((el) => el.getBoundingClientRect().top > 120)
        .slice(0, 60)
    }
    if (!items.length) return

    // 時間差は「同じ親の中での順番」で決める。最大8枚ぶんで頭打ちにする
    const seen = new Map<Element, number>()
    for (const el of items) {
      const group = el.closest('[data-rv-group]')
      if (group) {
        const i = seen.get(group) ?? 0
        seen.set(group, i + 1)
        el.style.setProperty('--reveal-delay', `${Math.min(i, 7) * 70}ms`)
      }
      el.setAttribute('data-reveal', 'out')
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.setAttribute('data-reveal', 'in')
          io.unobserve(e.target)
        }
      },
      // 画面の少し手前で入れておく。下端ギリギリで発火すると出現に気づけない
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    items.forEach((el) => io.observe(el))

    // 初期表示で既に画面内にあるものは、監視を待たずに出す（初回の取りこぼし防止）
    requestAnimationFrame(() => {
      for (const el of items) {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.setAttribute('data-reveal', 'in')
          io.unobserve(el)
        }
      }
    })

    // 保険: 監視が発火しなかった要素が消えたまま残るのを防ぐ。
    //
    // ⚠️ 「一定時間後に全部出す」にしてはいけない。ヒーローを読んでいる間に
    // ページ全体が出てしまい、スクロールしても何も動かなくなる。
    // 条件は「画面の下端より上に到達したもの」。つまり
    //   ・いま画面内にある    → 出す
    //   ・すでに通り過ぎた    → 出す（速くスクロールすると監視を取りこぼすため）
    //   ・まだ画面より下にある → 出さない（これがアニメの本体）
    const sweep = () => {
      const h = window.innerHeight
      document.querySelectorAll<HTMLElement>('[data-reveal="out"]').forEach((el) => {
        if (el.getBoundingClientRect().top < h) el.setAttribute('data-reveal', 'in')
      })
    }
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { sweep(); ticking = false })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    const timer = window.setInterval(sweep, 900)

    return () => {
      io.disconnect()
      window.clearInterval(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return null
}
