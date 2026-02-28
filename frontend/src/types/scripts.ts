// src/types/script.ts
// APIのレスポンスの型を定義する

export type Script = {
  id: number
  character: string
  text: string
  order: number
}

export type Chapter = {
  id: number
  title: string
  description: string | null
  order: number
  scripts: Script[]
}