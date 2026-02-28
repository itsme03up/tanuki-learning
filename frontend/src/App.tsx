// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import { TopPage } from './pages/TopPage'
import { useChapter } from './hooks/useChapter'
import { ChapterPage } from './pages/ChapterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/chapters/:id" element={<ChapterPage />} />
    </Routes>
  )
}

export default App
