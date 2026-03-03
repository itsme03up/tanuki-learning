// src/pages/TopPage.tsx
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Chapter } from '../types/index'
import { SkillTreePage } from './SkillTreePage'

const API_URL = 'http://localhost:8000'

export const TopPage = () => {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await axios.get(`${API_URL}/scripts/chapters`)
      setChapters(response.data)
      setLoading(false)
    }
    fetchChapters()
  }, [])

  if (loading) return <p>読み込み中...</p>

  return <SkillTreePage chapters={chapters} />
}