'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { generateForexContent } from '@/lib/openai'
import { FiCopy, FiDownload, FiLoader } from 'react-icons/fi'

export default function GeneratePage() {
  const router = useRouter()
  const { user, isLoading, setLoading } = useAuthStore()
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState<any>(null)

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic.trim()) {
      toast.error('Please enter a forex topic')
      return
    }

    setGenerating(true)

    try {
      const result = await generateForexContent(topic, tone)
      setContent(result)
      toast.success('Content generated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const downloadAsJSON = () => {
    if (!content) return
    const data = {
      topic,
      tone,
      generatedAt: new Date().toISOString(),
      content,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forex-content-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-accent">Generate Content</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Forex Topic
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Trading momentum in volatile markets"
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Tone</label>
                  <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="educational">Educational</option>
                    <option value="analytical">Analytical</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="flex w-full items-center justify-center gap-2 rounded bg-accent py-2 font-semibold text-dark hover:bg-opacity-90 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <FiLoader className="animate-spin" /> Generating...
                    </>
                  ) : (
                    'Generate Content'
                  )}
                </button>
              </form>

              {content && (
                <button
                  onClick={downloadAsJSON}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-accent py-2 font-semibold text-accent hover:bg-accent hover:text-dark"
                >
                  <FiDownload /> Download JSON
                </button>
              )}
            </div>
          </div>

          {/* Content Display Section */}
          <div className="lg:col-span-2">
            {content ? (
              <div className="space-y-6">
                {/* Social Media Posts */}
                <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
                  <h2 className="mb-4 text-xl font-bold text-accent">
                    📱 Social Media Posts ({content.socialPosts.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {content.socialPosts.map((post: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded border border-primary/30 bg-primary/10 p-3"
                      >
                        <p className="flex-1 text-sm text-gray-300">{post}</p>
                        <button
                          onClick={() => copyToClipboard(post)}
                          className="mt-1 text-accent hover:text-accent/80"
                        >
                          <FiCopy />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Threads */}
                <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
                  <h2 className="mb-4 text-xl font-bold text-accent">
                    📚 Educational Threads ({content.educationalThreads.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {content.educationalThreads.map((thread: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded border border-primary/30 bg-primary/10 p-3"
                      >
                        <p className="flex-1 text-sm text-gray-300 whitespace-pre-wrap">
                          {thread}
                        </p>
                        <button
                          onClick={() => copyToClipboard(thread)}
                          className="mt-1 text-accent hover:text-accent/80"
                        >
                          <FiCopy />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Telegram Messages */}
                <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
                  <h2 className="mb-4 text-xl font-bold text-accent">
                    ✈️ Telegram Messages ({content.telegramMessages.length})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {content.telegramMessages.map((msg: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded border border-primary/30 bg-primary/10 p-3"
                      >
                        <p className="flex-1 text-sm text-gray-300">{msg}</p>
                        <button
                          onClick={() => copyToClipboard(msg)}
                          className="mt-1 text-accent hover:text-accent/80"
                        >
                          <FiCopy />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg border border-secondary bg-secondary/10">
                <p className="text-center text-gray-400">
                  Enter a topic and click "Generate Content" to create amazing forex content
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
