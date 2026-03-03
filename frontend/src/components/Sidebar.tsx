// src/components/Sidebar.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import type { Chapter } from '../types/index'
import { useProgress } from '../hooks/useProgress'
import './Sidebar.css'

const API_URL = 'http://localhost:8000'
const XP_PER_LEVEL = 300

export const Sidebar = () => {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const navigate = useNavigate()
  const { id } = useParams()
  const { progress, isCompleted, isUnlocked } = useProgress()

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await axios.get(`${API_URL}/scripts/chapters`)
      setChapters(response.data)
    }
    fetchChapters()
  }, [])

  // XPバーの割合
  const xpInCurrentLevel = progress.totalXP % XP_PER_LEVEL
  const xpPercent = Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100)
  const gold = progress.completedChapters.length * 100

  return (
    <aside className="sidebar">
      {/* ロゴ */}
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <span className="sidebar-logo-icon">// CODE VOYAGER</span>
        <span className="sidebar-logo-text">NAVIGATION</span>
      </div>

      {/* ステータスパネル */}
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

      {/* コース一覧 */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-title">// MISSIONS</p>
        {chapters.map((chapter, index) => {
          const completed = isCompleted(chapter.id)
          const unlocked = isUnlocked(chapter.id, index)
          return (
            <div
              key={chapter.id}
              className={`sidebar-item ${String(id) === String(chapter.id) ? 'active' : ''} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && navigate(`/chapters/${chapter.id}`)}
            >
              {completed ? '✅ ' : unlocked ? '▶ ' : '🔒 '}
              {chapter.title}
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