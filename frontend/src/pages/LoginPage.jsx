import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Database, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import api from '../api/axios'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!email || !password || !username) {
            setError('Please fill in all fields')
            setIsLoading(false)
            return
        }

        if (!email.includes('@')) {
            setError('Please enter a valid email address')
            setIsLoading(false)
            return
        }

        try {
            const res = await api.post('/auth/token', { username, email, password })
            console.log(res.data);
            navigate('/dashboard')
        } catch (error) {
            console.log(error);
            setError('Invalid username, email, or password')
            return;
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full items-center">

                {/* Login Card */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl">
                    <div className="text-center mb-8">
                        <Database className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Sign in to your NL Database Assistant account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                UserName
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-3">
                            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="accent-indigo-500"
                                />
                                <span>Remember me</span>
                            </label>

                            <Link
                                to="#"
                                className="text-indigo-500 font-semibold hover:text-purple-600 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-6 border-t text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-indigo-500 font-semibold hover:text-purple-600"
                        >
                            Create one
                        </Link>
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden md:block text-white">
                    <h2 className="text-4xl font-bold mb-8 leading-tight">
                        Unlock Your Data's Potential
                    </h2>
                    <ul className="space-y-6 text-lg">
                        <li className="flex items-start gap-3">
                            <span className="bg-white/30 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                ✓
                            </span>
                            Query databases with natural language
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white/30 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                ✓
                            </span>
                            No SQL knowledge required
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white/30 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                ✓
                            </span>
                            Connect multiple databases
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white/30 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                ✓
                            </span>
                            Secure permission-based access
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-white/30 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                                ✓
                            </span>
                            Real-time results and analytics
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
