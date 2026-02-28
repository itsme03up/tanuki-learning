// src/pages/ChapterPage.tsx
// 対話UIを表示するチャプターページ
import { useParams } from 'react-router-dom'
import { useChapter } from '../hooks/useChapter'
import { ScriptViewer } from '../components/ScriptViewer'

export const ChapterPage = () => {
  const { id } = useParams()
  const { chapter, loading, error } = useChapter(Number(id))

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>{error}</p>
  if (!chapter) return <p>章が見つかりません</p>

  return <ScriptViewer chapter={chapter} />
}