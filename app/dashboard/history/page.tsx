'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export default function HistoryPage() {
  const router = useRouter()
  const { user, isLoading, setLoading } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) {
        router.push('/auth/login')
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router, setLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Unauthorized access</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-accent">Generation History</h1>

        <div className="rounded-lg border border-secondary bg-secondary/20 p-12 text-center">
          <p className="mb-4 text-lg text-gray-400">
            Your generation history will appear here
          </p>
          <p className="text-sm text-gray-500">
            Start by going to the{' '}
            <a href="/dashboard/generate" className="text-accent hover:underline">
              Generate page
            </a>{' '}
            to create your first content
          </p>
        </div>
      </div>
    </div>
  )
}
