'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SURVEY_QUESTIONS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { SurveyResult } from '@/types/database'

export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = SURVEY_QUESTIONS[currentStep]
  const progress = ((currentStep + 1) / SURVEY_QUESTIONS.length) * 100
  const isLastStep = currentStep === SURVEY_QUESTIONS.length - 1
  const canProceed = answers[currentQuestion.id]

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = async () => {
    if (!canProceed) return

    if (isLastStep) {
      setIsSubmitting(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from('profiles')
          .update({ survey_result: answers as unknown as SurveyResult })
          .eq('id', user.id)
      } else {
        localStorage.setItem('survey_result', JSON.stringify(answers))
      }

      router.push('/survey/result')
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-muted font-medium">
            {currentStep + 1}/{SURVEY_QUESTIONS.length}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">
          {currentQuestion.question}
        </h1>

        <div className="space-y-3">
          {currentQuestion.options.map(option => {
            const isSelected = answers[currentQuestion.id] === option.value
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg scale-[1.02]'
                    : 'bg-white border-2 border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium flex-1">{option.label}</span>
                {isSelected && <Check className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-border p-4 safe-area-pb">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              '분석 중...'
            ) : isLastStep ? (
              <>
                결과 보기
                <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                다음
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  )
}
