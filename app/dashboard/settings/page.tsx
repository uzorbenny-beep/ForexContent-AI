'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading, setLoading, logout } = useAuthStore()

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    router.push('/auth/login')
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
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-accent">Settings</h1>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">User ID</label>
                <p className="mt-1 break-all text-sm text-gray-500">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Member Since</label>
                <p className="mt-1 text-white">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="rounded-lg border border-secondary bg-secondary/20 p-6">
            <h2 className="mb-4 text-2xl font-bold text-white">Subscription</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400">Current Plan</label>
              <p className="mt-1 capitalize text-white">{user.subscription_tier}</p>
            </div>
            <button className="rounded bg-accent px-4 py-2 font-semibold text-dark hover:bg-opacity-90">
              Upgrade Plan
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="mb-4 text-2xl font-bold text-red-500">Danger Zone</h2>
            <button
              onClick={handleLogout}
              className="rounded border border-red-500 px-4 py-2 font-semibold text-red-500 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
