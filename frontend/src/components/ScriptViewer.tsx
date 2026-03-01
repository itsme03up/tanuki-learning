// src/components/ScriptViewer.tsx
import { useState, useEffect, useRef } from 'react'
import type { Chapter } from '../types/index'
import { RubyText } from './RubyText'
import './ScriptViewer.css'

type Props = {
  chapter: Chapter
}

const SPEED_OPTIONS = [
  { label: '遅い', ms: 2500 },
  { label: '普通', ms: 1200 },
  { label: '速い', ms: 600 },
]

export const ScriptViewer = ({ chapter }: Props) => {
  const [visibleCount, setVisibleCount] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1) // デフォルト：普通
  const bottomRef = useRef<HTMLDivElement>(null)

  const visibleScripts = chapter.scripts.slice(0, visibleCount)
  const isComplete = visibleCount >= chapter.scripts.length
  const currentSpeed = SPEED_OPTIONS[speedIndex]

  // 一定間隔で次のセリフを表示
  useEffect(() => {
    if (isComplete || isPaused) return

    const timer = setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + 1, chapter.scripts.length)
      )
    }, currentSpeed.ms)

    return () => clearTimeout(timer)
  }, [visibleCount, isComplete, isPaused, currentSpeed.ms, chapter.scripts.length])

  // 新しいセリフが追加されたら自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleCount])

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          🦝 {chapter.title}
        </div>
        <div className="chat-progress">
          {Math.min(visibleCount, chapter.scripts.length)} / {chapter.scripts.length}
        </div>

        <div className="chat-messages">
          {visibleScripts.map((script) => {
            const isSensei = script.character === '先生'
            return isSensei ? (
              <div key={script.id} className="message-left">
                <div className="avatar">🦝</div>
                <div>
                  <div className="speaker-name">狸塚先生</div>
                  <div className="bubble">
                    <RubyText text={script.text} />
                  </div>
                </div>
              </div>
            ) : (
              <div key={script.id} className="message-right">
                <div>
                  <div className="speaker-name">{script.character}</div>
                  <div className="bubble">
                    <RubyText text={script.text} />
                  </div>
                </div>
                <div className="avatar" style={{ background: '#a0c8e6' }}>👧</div>
              </div>
            )
          })}

          {!isComplete && (
            <div className="scroll-trigger">
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            </div>
          )}

          {isComplete && (
            <div className="chat-complete">
              ✅ このチャプターはここまでです！
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* コントロールバー */}
        <div className="chat-controls">
          {/* 一時停止・再開ボタン */}
          <button
            className="control-button pause-button"
            onClick={() => setIsPaused((prev) => !prev)}
            disabled={isComplete}
          >
            {isPaused ? '▶ 再開' : '⏸ 一時停止'}
          </button>

          {/* 速度切替 */}
          <div className="speed-controls">
            {SPEED_OPTIONS.map((option, index) => (
              <button
                key={option.label}
                className={`speed-button ${speedIndex === index ? 'active' : ''}`}
                onClick={() => setSpeedIndex(index)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}