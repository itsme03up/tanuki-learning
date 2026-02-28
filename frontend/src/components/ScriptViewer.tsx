// src/components/ScriptViewer.tsx
import { useState } from 'react'
import type { Chapter } from '../types/index'
import { RubyText } from './RubyText'
import './ScriptViewer.css'

type Props = {
  chapter: Chapter
}

export const ScriptViewer = ({ chapter }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentScript = chapter.scripts[currentIndex]
  const isLast = currentIndex === chapter.scripts.length - 1
  const isSensei = currentScript.character === '先生'

  const handleNext = () => {
    if (!isLast) setCurrentIndex(currentIndex + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="chat-container">
      {/* ヘッダー */}
      <div className="chat-header">
        🦝 {chapter.title}
      </div>
      <div className="chat-progress">
        {currentIndex + 1} / {chapter.scripts.length}
      </div>

      {/* 吹き出し */}
      <div className="chat-messages">
        {isSensei ? (
          <div className="message-left">
            <div className="avatar">🦝</div>
            <div>
              <div className="speaker-name">狸塚先生</div>
              <div className="bubble-left">
                <RubyText text={currentScript.text} />
              </div>
            </div>
          </div>
        ) : (
          <div className="message-right">
            <div>
              <div className="speaker-name" style={{ textAlign: 'right' }}>
                {currentScript.character}
              </div>
              <div className="bubble-right">
                <RubyText text={currentScript.text} />
              </div>
            </div>
            <div className="avatar" style={{ background: '#a0c8e6' }}>👧</div>
          </div>
        )}
      </div>

      {/* ナビゲーション */}
      <div className="chat-footer">
        <button
          className="nav-button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← 前へ
        </button>
        <button
          className="nav-button nav-button-next"
          onClick={handleNext}
          disabled={isLast}
        >
          次へ →
        </button>
      </div>
    </div>
  )
}