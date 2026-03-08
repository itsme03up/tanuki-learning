// src/App.tsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TopPage } from './pages/TopPage'
import { CoursePage } from './pages/CoursePage'
import { ChapterPage } from './pages/ChapterPage'
import { ProfilePage } from './pages/ProfilePage'
import { PilotNameModal } from './components/PilotNameModal'
import { useProgress } from './hooks/useProgress'
import { ColumnsPage } from './pages/ColumnsPage'
import { ColumnDetailPage } from './pages/ColumnDetailPage'
import { TutorialPage } from './pages/TutorialPage'


function App() {
  const { progress, setPilotName } = useProgress()
  const [modalDismissed, setModalDismissed] = useState(false)
  const [tutorialDismissed, setTutorialDismissed] = useState(false)

  const showModal = progress.pilotName === '' && !modalDismissed
  const showTutorial = progress.pilotName !== '' && !progress.tutorialCompleted && !modalDismissed


  return (
      <>
      {showModal && (
        <PilotNameModal
          onComplete={(name: string) => {
            setPilotName(name)
            setModalDismissed(true)
          }}
        />
      )}
      {showTutorial && (
        <TutorialPage onComplete={() => setTutorialDismissed(true)} />
      )}
      <Layout>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/chapters/:id" element={<ChapterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/columns" element={<ColumnsPage />} />
          <Route path="/columns/:id" element={<ColumnDetailPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App

