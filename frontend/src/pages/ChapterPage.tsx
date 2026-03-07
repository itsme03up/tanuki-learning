// src/pages/ChapterPage.tsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChapterContent } from '../hooks/useChapterContent'
import { useProgress } from '../hooks/useProgress'
import { useChapter } from '../hooks/useChapter'
import type { Quiz, Terminal } from '../types/index'
import './ChapterPage.css'

type Phase = 'quiz' | 'terminal' | 'complete'

export const ChapterPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const chapterId = Number(id)
  const { quizzes, terminals, loading } = useChapterContent(chapterId)
  const { completeChapter } = useProgress()
  const { course } = useChapter(chapterId)

  const [phase, setPhase] = useState<Phase>('quiz')
  const [quizIndex, setQuizIndex] = useState(0)
  const [terminalIndex, setTerminalIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalResult, setTerminalResult] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)

  if (loading) return <div className="chapter-loading">LOADING...</div>

  const currentQuiz: Quiz = quizzes[quizIndex]
  const currentTerminal: Terminal = terminals[terminalIndex]

  // Quiz: 選択肢をクリック
  const handleChoiceSelect = (choiceId: number) => {
    if (showResult) return
    setSelectedChoice(choiceId)
    setShowResult(true)
  }

  // Quiz: 次へ
  const handleQuizNext = () => {
    if (quizIndex + 1 < quizzes.length) {
      setQuizIndex(quizIndex + 1)
      setSelectedChoice(null)
      setShowResult(false)
    } else {
      // Terminalがあれば次へ、なければ完了
      if (terminals.length > 0) {
        setPhase('terminal')
      } else {
        handleComplete()
      }
    }
  }

  // Terminal: 答え合わせ
  const handleTerminalSubmit = () => {
    const correct = terminalInput.trim() === currentTerminal.answer.trim()
    setTerminalResult(correct ? 'correct' : 'wrong')
  }

  // Terminal: 次へ
  const handleTerminalNext = () => {
    if (terminalIndex + 1 < terminals.length) {
      setTerminalIndex(terminalIndex + 1)
      setTerminalInput('')
      setTerminalResult(null)
      setShowHint(false)
    } else {
      handleComplete()
    }
  }

  // 完了処理
  const handleComplete = () => {
    const allChapterIds = course?.chapters.map(ch => ch.id)
    completeChapter(chapterId, course?.id, allChapterIds)
    setPhase('complete')
  }

  return (
    <div className="chapter-wrapper">
      {/* ヘッダー */}
      <div className="chapter-header">
        <span className="chapter-back" onClick={() => navigate(-1)}>← BACK</span>
        <div className="chapter-phase-indicator">
          <span className={phase === 'quiz' ? 'active' : ''}>QUIZ</span>
          <span className="divider">//</span>
          <span className={phase === 'terminal' ? 'active' : ''}>TERMINAL</span>
        </div>
      </div>

      <div className="chapter-content">

        {/* QUIZ フェーズ */}
        {phase === 'quiz' && currentQuiz && (
          <div className="quiz-container">
            <div className="quiz-label">// QUIZ {quizIndex + 1} / {quizzes.length}</div>
            <div className="quiz-question">{currentQuiz.question}</div>

            <div className="quiz-choices">
              {currentQuiz.choices.map((choice) => {
                const isSelected = selectedChoice === choice.id
                const isCorrect = choice.is_correct === 1
                let className = 'quiz-choice'
                if (showResult && isSelected && isCorrect) className += ' correct'
                if (showResult && isSelected && !isCorrect) className += ' wrong'
                if (showResult && !isSelected && isCorrect) className += ' correct-hint'

                return (
                  <div
                    key={choice.id}
                    className={className}
                    onClick={() => handleChoiceSelect(choice.id)}
                  >
                    {choice.text}
                  </div>
                )
              })}
            </div>

            {showResult && (
              <div className="quiz-result">
                <div className="quiz-explanation">{currentQuiz.explanation}</div>
                <button className="chapter-button" onClick={handleQuizNext}>
                  {quizIndex + 1 < quizzes.length ? 'NEXT QUIZ →' : terminals.length > 0 ? 'TERMINAL へ →' : 'COMPLETE →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TERMINAL フェーズ */}
        {phase === 'terminal' && currentTerminal && (
          <div className="terminal-container">
            <div className="quiz-label">// TERMINAL {terminalIndex + 1} / {terminals.length}</div>
            <div className="terminal-description">{currentTerminal.description}</div>

            {/* コマンド入力エリア */}
            <div className="terminal-input-wrapper">
              <span className="terminal-prompt">$</span>
              {currentTerminal.command_template !== '___' && (
                <span className="terminal-template">
                  {currentTerminal.command_template.replace('___', '')}
                </span>
              )}
              <input
                className="terminal-input"
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !terminalResult && handleTerminalSubmit()}
                disabled={terminalResult !== null}
                placeholder="コマンドを入力..."
                autoFocus
              />
            </div>

            {/* ヒント */}
            {!terminalResult && (
              <div className="terminal-hint-area">
                {!showHint ? (
                  <span className="hint-toggle" onClick={() => setShowHint(true)}>
                    💡 ヒントを見る
                  </span>
                ) : (
                  <span className="hint-text">{currentTerminal.hint}</span>
                )}
              </div>
            )}

            {/* 送信ボタン */}
            {!terminalResult && (
              <button className="chapter-button" onClick={handleTerminalSubmit}>
                EXECUTE
              </button>
            )}

            {/* 結果 */}
            {terminalResult && (
              <div className={`terminal-result ${terminalResult}`}>
                {terminalResult === 'correct' ? (
                  <div>
                    <div className="result-label">✅ CORRECT</div>
                    <div className="quiz-explanation">{currentTerminal.explanation}</div>
                  </div>
                ) : (
                  <div>
                    <div className="result-label">❌ WRONG</div>
                    <div className="quiz-explanation">正解: {currentTerminal.answer}</div>
                  </div>
                )}
                <button className="chapter-button" onClick={handleTerminalNext}>
                  {terminalIndex + 1 < terminals.length ? 'NEXT →' : 'COMPLETE →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* COMPLETE フェーズ */}
        {phase === 'complete' && (
          <div className="complete-container">
            {/* 花火 */}
            <div className="fireworks">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`firework firework-${i % 6}`}>
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="particle" />
                  ))}
                </div>
              ))}
            </div>
            <div className="complete-title">MISSION COMPLETE</div>
            <div className="complete-reward">
              <span>🪙 +100 GOLD</span>
              <span>⭐ +100 XP</span>
            </div>
            <div className="complete-buttons">
              <button className="chapter-button" onClick={() => navigate(-1)}>
                BACK TO MAP →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}