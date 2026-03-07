// src/components/RubyText.tsx
// （漢字）形式のテキストをrubyタグに変換するコンポーネント

type Props = {
  text: string
}

export const RubyText = ({ text }: Props) => {
  // 「漢字（ふりがな）」のパターンを検出して変換する
  const parts = text.split(/（([^）]+)）/)

  // splitすると ["前のテキスト", "ふりがな", "後のテキスト", ...] の形になる
  const elements = parts.map((part, index) => {
    // 偶数インデックス = 通常テキスト、奇数インデックス = ふりがな
    if (index % 2 === 1) {
      // ひとつ前のテキストの最後の文字を漢字として取得
      return null
    }

    // ふりがなが続く場合はrubyタグで囲む
    const nextPart = parts[index + 1]
    if (nextPart !== undefined) {
      const kanji = part.slice(-1) === '' ? part : part.match(/[^\x00-\x7F]+$/)
      const before = kanji ? part.slice(0, part.length - kanji[0].length) : part

      if (kanji) {
        return (
          <span key={index}>
            {before}
            <ruby>
              {kanji[0]}
              <rt>{nextPart}</rt>
            </ruby>
          </span>
        )
      }
    }
    return <span key={index}>{part}</span>
  })

  return <span>{elements}</span>
}

const rubyRegex = /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g