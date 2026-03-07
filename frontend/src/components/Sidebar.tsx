// src/components/Sidebar.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import type { Course } from '../types/index'
import { useProgress } from '../hooks/useProgress'
import './Sidebar.css'

const API_URL = 'http://localhost:8000'
const XP_PER_LEVEL = 300

export const Sidebar = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const navigate = useNavigate()
  const { id } = useParams()
  const { progress, isCompleted } = useProgress()

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await axios.get(`${API_URL}/api/courses`)
      setCourses(response.data)
    }
    fetchCourses()
  }, [])

  const xpInCurrentLevel = progress.totalXP % XP_PER_LEVEL
  const xpPercent = Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100)
  const gold = progress.completedChapters.length * 100

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <span className="sidebar-logo-icon">// CODE VOYAGER</span>
        <span className="sidebar-logo-text">NAVIGATION</span>
      </div>

      <div className="sidebar-status">
        <div className="status-row">
          <span className="status-label">LEVEL</span>
          <span className="status-value">{progress.level}</span>
        </div>
        <div className="xp-bar-wrapper">
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="xp-bar-label">
            <span>XP</span>
            <span>{xpInCurrentLevel} / {XP_PER_LEVEL}</span>
          </div>
        </div>
        <div className="status-row">
          <span className="status-label">GOLD</span>
          <span className="status-value gold">🪙 {gold}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">// MISSIONS</p>
        {courses.map((course) => {
          const allCompleted = course.chapters.every((ch) => isCompleted(ch.id))
          return (
            <div
              key={course.id}
              className={`sidebar-item ${String(id) === String(course.id) ? 'active' : ''} ${allCompleted ? 'completed' : ''}`}
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {allCompleted ? '✅ ' : '▶ '}
              {course.icon} {course.title}
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        SYSTEM v0.1.0 // ONLINE
      </div>
    </aside>
  )
}