// src/pages/TopPage.tsx
// コース一覧を表示するトップページ
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { Chapter } from '../types/index'

const API_URL = 'http://localhost:8000'

export const TopPage = () => {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await axios.get(`${API_URL}/scripts/chapters`)
      setChapters(response.data)
      setLoading(false)
    }
    fetchChapters()
  }, [])

  if (loading) return <p>読み込み中...</p>

  return (
    <div>
      <h1>🦝 狸塚先生の学習サイト</h1>
      <h2>コース一覧</h2>
      {chapters.map((chapter) => (
        <div
          key={chapter.id}
          onClick={() => navigate(`/chapters/${chapter.id}`)}
          style={{ cursor: 'pointer', padding: '16px', border: '1px solid #ccc', marginBottom: '8px' }}
        >
          <h3>{chapter.title}</h3>
        </div>
      ))}
    </div>
  )
}