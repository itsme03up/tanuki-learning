// src/hooks/useCourses.ts
// コース一覧をAPIから取得するカスタムフック

import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Course } from '../types/index'

const API_URL = 'http://localhost:8000'

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/courses`)
        setCourses(response.data)
      } catch {
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return { courses, loading, error }
}