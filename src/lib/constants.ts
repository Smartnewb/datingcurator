export const SURVEY_QUESTIONS = [
  {
    id: 'food_preference',
    question: '어떤 음식을 좋아하세요?',
    options: [
      { value: 'korean', label: '한식', emoji: '🍚' },
      { value: 'western', label: '양식', emoji: '🍝' },
      { value: 'japanese', label: '일식', emoji: '🍣' },
      { value: 'cafe', label: '카페/디저트', emoji: '☕' },
      { value: 'any', label: '다 좋아요', emoji: '😋' },
    ],
  },
  {
    id: 'atmosphere',
    question: '어떤 분위기를 선호하세요?',
    options: [
      { value: 'cozy', label: '아늑하고 조용한', emoji: '🕯️' },
      { value: 'trendy', label: '트렌디하고 감성있는', emoji: '✨' },
      { value: 'lively', label: '활기차고 재미있는', emoji: '🎉' },
      { value: 'outdoor', label: '야외/자연 속', emoji: '🌳' },
      { value: 'any', label: '상관없어요', emoji: '🤷' },
    ],
  },
  {
    id: 'budget',
    question: '1인당 예산은 어느 정도인가요?',
    options: [
      { value: 'low', label: '1만원 이하', emoji: '💰' },
      { value: 'medium', label: '1~3만원', emoji: '💵' },
      { value: 'high', label: '3만원 이상', emoji: '💎' },
      { value: 'any', label: '상관없어요', emoji: '🤷' },
    ],
  },
  {
    id: 'date_type',
    question: '어떤 유형의 데이트를 원하세요?',
    options: [
      { value: 'food', label: '맛집 탐방', emoji: '🍽️' },
      { value: 'cafe', label: '카페 투어', emoji: '☕' },
      { value: 'activity', label: '액티비티/체험', emoji: '🎮' },
      { value: 'chill', label: '힐링/산책', emoji: '🚶' },
      { value: 'any', label: '다 좋아요', emoji: '💕' },
    ],
  },
  {
    id: 'time_preference',
    question: '주로 언제 데이트하세요?',
    options: [
      { value: 'lunch', label: '점심 (11-14시)', emoji: '☀️' },
      { value: 'afternoon', label: '오후 (14-18시)', emoji: '🌤️' },
      { value: 'dinner', label: '저녁 (18-21시)', emoji: '🌙' },
      { value: 'night', label: '밤 (21시 이후)', emoji: '🌃' },
      { value: 'any', label: '상관없어요', emoji: '⏰' },
    ],
  },
] as const

export type SurveyQuestionId = typeof SURVEY_QUESTIONS[number]['id']
