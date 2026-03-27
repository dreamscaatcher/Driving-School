export interface Option {
  label: 'A' | 'B' | 'C'
  text: string
}

export interface QuestionImage {
  src: string
  alt: string
  type: 'sign' | 'scenario' | 'urban' | 'motorway' | 'conditions'
}

export interface Question {
  id: number
  category: string
  question: string
  image?: QuestionImage
  options: Option[]
  correct: 'A' | 'B' | 'C'
  law?: string
  explanation?: string
}

export interface Category {
  id: string
  label: string
  icon: string
  color: string
  description: string
}
