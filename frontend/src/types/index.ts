// src/types/index.ts

export type Script = {
  id: number
  text: string
  order: number
  chapter_id: number
}

export type Chapter = {
  id: number
  course_id: number
  title: string
  description: string | null
  order: number
  scripts: Script[]
  dependency_ids: number[]
}

export type Course = {
  id: number
  title: string
  description: string | null
  icon: string | null
  order: number
  chapters: Chapter[]
}

export type QuizChoice = {
  id: number
  text: string
  is_correct: number
}

export type Quiz = {
  id: number
  chapter_id: number
  question: string
  explanation: string | null
  order: number
  choices: QuizChoice[]
}

export type Terminal = {
  id: number
  chapter_id: number
  description: string
  command_template: string
  answer: string
  hint: string | null
  explanation: string | null
  order: number
}