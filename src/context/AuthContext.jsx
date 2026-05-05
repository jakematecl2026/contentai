import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setBrand(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(uid) {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(prof)
    const { data: br } = await supabase.from('brands').select('*').eq('user_id', uid).single()
    setBrand(br || null)
    setLoading(false)
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
    return { data, error }
  }

  async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function saveBrand(brandData) {
    if (brand?.id) {
      const { data } = await supabase.from('brands').update({ ...brandData, updated_at: new Date().toISOString() }).eq('id', brand.id).select().single()
      setBrand(data)
    } else {
      const { data } = await supabase.from('brands').insert({ ...brandData, user_id: user.id }).select().single()
      setBrand(data)
    }
  }

  async function saveCreation(type, title, content) {
    await supabase.from('creations').insert({ user_id: user.id, type, title, content })
    // Increment count
    const field = type === 'carousel' ? 'carousel_count' : type === 'caption' ? 'caption_count' : null
    if (field) {
      await supabase.from('profiles').update({ [field]: (profile?.[field] || 0) + 1 }).eq('id', user.id)
      setProfile(p => ({ ...p, [field]: (p?.[field] || 0) + 1 }))
    }
  }

  async function upgradeToPro() {
    await supabase.from('profiles').update({ plan: 'pro' }).eq('id', user.id)
    setProfile(p => ({ ...p, plan: 'pro' }))
  }

  const isPro = profile?.plan === 'pro'
  const canCarousel = isPro || (profile?.carousel_count || 0) < 3
  const canCaption = isPro || (profile?.caption_count || 0) < 5

  return (
    <AuthContext.Provider value={{
      user, profile, brand, loading,
      signUp, signIn, signOut,
      saveBrand, saveCreation, upgradeToPro,
      isPro, canCarousel, canCaption,
      reloadBrand: () => loadProfile(user?.id)
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
