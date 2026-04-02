import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user:    User | null
  loading: boolean
  error:   string | null

  init:     () => () => void   // returns unsubscribe fn
  signIn:   (email: string, password: string) => Promise<void>
  signUp:   (email: string, password: string) => Promise<void>
  signOut:  () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:    null,
  loading: true,
  error:   null,

  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ user: data.session?.user ?? null, loading: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, loading: false })
    })

    return () => subscription.unsubscribe()
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) set({ error: error.message, loading: false })
    else set({ loading: false })
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null })
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) set({ error: error.message, loading: false })
    else set({ loading: false })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))
