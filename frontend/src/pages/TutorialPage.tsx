// src/pages/TutorialPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { FileSystemMap } from '../components/FileSystemMap'
import './TutorialPage.css'

type Step =
  | { type: 'text'; lines: string[] }
  | { type: 'map'; lines: string[] }
  | { type: 'terminal'; description: string; answer: string; hint: string; successMessage: string }

const STEPS: Step[] = [
  {
    type: 'text',
    lines: [
      'ようこそ、CODE VOYAGERへ',
      '',
      'この宇宙では、すべての惑星が',
      'コンピューターで動いている',
      '',
      '通信衛星、宇宙船、惑星基地——',
      'それらを「コード」で動かすのがエンジニアの仕事だ',
    ]
  },
  {
    type: 'terminal',
    description: 'まず、今いる場所を確認しよう',
    answer: 'pwd',
    hint: 'pwd と入力してEnterを押そう',
    successMessage: 'よくやった！ /home にいることが確認できた\nエンジニアは常に「今どこにいるか」を知る必要がある',
  },
  {
    type: 'map',
    lines: [
      'これが宇宙船のファイルシステムだ。',
      '',
      'すべてのデータは「/」（ルート）を',
      '中心にした星系に保存されている。',
      '',
      '君の宇宙船は /home/user にいる。',
    ]
  },
  {
    type: 'text',
    lines: [
      'ミッション準備完了！',
      '',
      '最初のミッションを',
      '選んで出発しよう。',
    ]
  },
]

export const TutorialPage = ({ onComplete }: { onComplete: () => void }) => {
  const navigate = useNavigate()
  const { completeTutorial } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalResult, setTerminalResult] = useState<'correct' | 'wrong' | null>(null)

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      completeTutorial()
      onComplete()
    } else {
      setStepIndex(stepIndex + 1)
      setTerminalInput('')
      setTerminalResult(null)
    }
  }

  const handleSkip = () => {
    completeTutorial()
    onComplete()
  }

  const handleTerminalSubmit = () => {
    if (step.type !== 'terminal') return
    const correct = terminalInput.trim() === step.answer
    setTerminalResult(correct ? 'correct' : 'wrong')
  }

  return (
    <div className="tutorial-wrapper">
      <button className="tutorial-skip" onClick={handleSkip}>SKIP →</button>

      <div className="tutorial-boot-header">
        BOOT SEQUENCE // SYSTEM ONLINE
      </div>

      <div className="tutorial-content">

        {step.type === 'text' && (
          <div className="tutorial-text-block">
            {step.lines.map((line, i) => (
              line === ''
                ? <div key={i} className="tutorial-spacer" />
                : <p key={i} className="tutorial-line">{line}</p>
            ))}
            <button className="tutorial-next" onClick={handleNext}>
              {isLast ? 'START MISSION →' : 'NEXT →'}
            </button>
          </div>
        )}

        {step.type === 'map' && (
          <div className="tutorial-map-block">
            <div className="tutorial-map-text">
              {step.lines.map((line, i) => (
                line === ''
                  ? <div key={i} className="tutorial-spacer" />
                  : <p key={i} className="tutorial-line">{line}</p>
              ))}
              <button className="tutorial-next" onClick={handleNext}>つぎへ →</button>
            </div>
            <div className="tutorial-map-figure">
              <FileSystemMap currentPath="/home" />
            </div>
          </div>
        )}

        {step.type === 'terminal' && (
          <div className="tutorial-terminal-block">
            {step.description.split('\n').map((line, i) => (
              <p key={i} className="tutorial-line">{line}</p>
            ))}

            <div className="tutorial-terminal-input-wrapper">
              <span className="terminal-prompt">$</span>
              <input
                id="tutorial-terminal-input"
                className="terminal-input"
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !terminalResult && handleTerminalSubmit()}
                disabled={terminalResult === 'correct'}
                placeholder="コマンドを入力..."
                autoFocus
              />
            </div>

            {!terminalResult && (
              <>
                <p className="tutorial-hint">💡 {step.hint}</p>
                <button className="tutorial-next" onClick={handleTerminalSubmit}>EXECUTE</button>
              </>
            )}

            {terminalResult === 'correct' && (
              <div className="tutorial-result-correct">
                {step.successMessage.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <button className="tutorial-next" onClick={handleNext}>
                  {isLast ? 'START MISSION →' : 'NEXT →'}
                </button>
              </div>
            )}

            {terminalResult === 'wrong' && (
              <div className="tutorial-result-wrong">
                <p>もう一度試してみよう 💪</p>
                <button className="tutorial-next" onClick={() => {
                  setTerminalResult(null)
                  setTerminalInput('')
                }}>
                  やり直す →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}