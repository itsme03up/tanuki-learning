// src/hooks/useProgress.ts
// 学習進捗をlocalStorageで管理するカスタムフック

import { useState, useEffect } from 'react'

type Progress = {
  completedChapters: number[]  // 完了したチャプターのID一覧
  level: number                // 現在のレベル
  totalXP: number              // 累計経験値
  badges: string[]             // 獲得バッジ一覧
}

const INITIAL_PROGRESS: Progress = {
  completedChapters: [],
  level: 1,
  totalXP: 0,
  badges: [],
}

const XP_PER_CHAPTER = 100    // チャプター完了で得られるXP
const XP_PER_LEVEL = 300      // レベルアップに必要なXP

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>(() => {
    // 初回はlocalStorageから読み込む
    const saved = localStorage.getItem('tanuki-progress')
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS
  })

  // progressが変わるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('tanuki-progress', JSON.stringify(progress))
  }, [progress])

  // チャプター完了時の処理
  const completeChapter = (chapterId: number): { levelUp: boolean, newLevel: number } => {
    let levelUp = false
    let newLevel = progress.level

    setProgress((prev) => {
      // すでに完了済みなら何もしない
      if (prev.completedChapters.includes(chapterId)) return prev

      const newXP = prev.totalXP + XP_PER_CHAPTER
      newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1
      levelUp = newLevel > prev.level

      return {
        ...prev,
        completedChapters: [...prev.completedChapters, chapterId],
        totalXP: newXP,
        level: newLevel,
        badges: [...prev.badges, `chapter_${chapterId}`],
      }
    })

    return { levelUp, newLevel }
  }

  // チャプターが解放されているか確認
  const isUnlocked = (chapterId: number, chapterOrder: number): boolean => {
    if (chapterOrder === 0) return true  // 最初のチャプターは常に解放
    return progress.completedChapters.includes(chapterId - 1)
  }

  const isCompleted = (chapterId: number): boolean => {
    return progress.completedChapters.includes(chapterId)
  }

  return { progress, completeChapter, isUnlocked, isCompleted }
}