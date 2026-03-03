// src/pages/SkillTreePage.tsx
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import type { Chapter } from '../types/index'
import './SkillTreePage.css'

type Props = {
  chapters: Chapter[]
}

export const SkillTreePage = ({ chapters }: Props) => {
  const navigate = useNavigate()
  const { isUnlocked, isCompleted } = useProgress()

  return (
    <div className="skilltree-wrapper">
      <div className="skilltree-header">
        <h1 className="skilltree-title">🦝 狸塚先生の教室</h1>
        <p className="skilltree-subtitle">スキルツリー</p>
      </div>

      <div className="skilltree-nodes">
        {chapters.map((chapter, index) => {
          const unlocked = isUnlocked(chapter.id, index)
          const completed = isCompleted(chapter.id)

          return (
            <div key={chapter.id} className="skilltree-node-wrapper">
              {/* ノード間の線 */}
              {index > 0 && (
                <div className={`skilltree-line ${unlocked ? 'unlocked' : ''}`} />
              )}

              {/* ノード */}
              <div
                className={`skilltree-node ${completed ? 'completed' : ''} ${unlocked && !completed ? 'unlocked' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => unlocked && navigate(`/chapters/${chapter.id}`)}
              >
                <div className="node-icon">
                  {completed ? '✅' : unlocked ? '📖' : '🔒'}
                </div>
                <div className="node-title">{chapter.title}</div>
                {completed && <div className="node-badge">CLEAR</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}