'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from './axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // useEffect(() => {
    //     checkAuth()
    // }, [])
    //
    // const checkAuth = async () => {
    //     try {
    //         const { data } = await api.get('/api/user')
    //         setUser(data)
    //     } catch (error) {
    //         setUser(null)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const login = async (email, password) => {
        try {
            // Get CSRF cookie first
            await api.get('/sanctum/csrf-cookie')
            //
            // // Attempt login
            await api.post('/login', { email, password })
            // const token = decodeURIComponent(
            //     document.cookie.split("; ").find(c => c.startsWith("XSRF-TOKEN="))?.split("=")[1] || ""
            // );
            //
            // await api.post("/login", { email, password }, {
            //     headers: { "X-XSRF-TOKEN": token }
            // });

            // Get user data after successful login
            const { data } = await api.get('/api/user')
            setUser(data)

            router.push('/products')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed'
            return { success: false, error: message }
        }
    }

    const register = async (name, email, password, password_confirmation) => {
        try {
            // Get CSRF cookie first
            await api.get('/sanctum/csrf-cookie')

            // Register user
            await api.post('/register', {
                name,
                email,
                password,
                password_confirmation
            })

            // Get user data after successful registration
            const { data } = await api.get('/api/user')
            setUser(data)

            router.push('/products')
            return { success: true }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            return { success: false, error: message }
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setUser(null)
            router.push('/login')
        }
    }

    return (
        <AuthContext.Provider value={{
        user,
            login,
            register,
            logout,
            loading,
            // checkAuth
    }}>
    {children}
    </AuthContext.Provider>
)
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}