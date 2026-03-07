// src/hooks/useChapter.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Chapter } from '../types/index'

const API_URL = 'http://localhost:8000'

export const useChapter = (chapterId: number) => {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get(`${API_URL}/api/chapters/${chapterId}`).then(res => setChapter(res.data))
  }, [chapterId])

  return { chapter, loading, error }
}