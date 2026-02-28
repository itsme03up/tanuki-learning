// src/hooks/useChapter.ts
// 章データをAPIから取得するカスタムフック

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Chapter } from '../types/script'

const API_URL = 'http://localhost:8000'

export const useChapter = (chapterId: number) => {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`${API_URL}/scripts/chapters/${chapterId}`)
        setChapter(response.data)
      } catch (e) {
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchChapter()
  }, [chapterId])

  return { chapter, loading, error }
}