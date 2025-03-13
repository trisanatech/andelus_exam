'use client'

import { useEffect, useState } from "react"
import { getExamById } from "@/actions/exam"

export function useExamTimer(examId: string) {
  const [exam, setExam] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const loadExam = async () => {
      const examData = await getExamById(examId)
      if (!examData) return
      
      setExam(examData)
      const endTime = new Date(examData.endAt).getTime()
      setTimeLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)))
    }

    loadExam()
  }, [examId])

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  return { data: exam, timeLeft }
}