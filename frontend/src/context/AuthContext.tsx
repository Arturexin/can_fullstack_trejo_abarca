
import { createContext, useEffect, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  user: { email: string; id: number } | null
  login: (token: string, user: any) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<{ email: string; id: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (stored) setToken(stored)
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])
  const login = (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  console.log('useAuth', ctx)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}