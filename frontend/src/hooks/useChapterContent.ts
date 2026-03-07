// src/hooks/useChapterContent.ts
import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Quiz, Terminal } from '../types/index'

const API_URL = 'http://localhost:8000'

export const useChapterContent = (chapterId: number) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [terminals, setTerminals] = useState<Terminal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const [qRes, tRes] = await Promise.all([
        axios.get(`${API_URL}/api/chapters/${chapterId}/quizzes`),
        axios.get(`${API_URL}/api/chapters/${chapterId}/terminals`),
      ])
      setQuizzes(qRes.data)
      setTerminals(tRes.data)
      setLoading(false)
    }
    fetch()
  }, [chapterId])

  return { quizzes, terminals, loading }
}