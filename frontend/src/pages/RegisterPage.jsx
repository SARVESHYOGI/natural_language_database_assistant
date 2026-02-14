import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Database, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import api from '../api/axios'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        }

        if (!formData.email.includes('@')) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)
        console.log(formData);

        try {
            const res = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
            console.log(formData);
            console.log(res.data);
            navigate('/dashboard')
        } catch (error) {
            console.log(error);
            setErrors({ ...errors, general: 'Registration failed. Please try again.' });
            return;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">

                {/* Left Card */}
                <div className="bg-white rounded-2xl p-5 shadow-2xl">
                    <div className="text-center mb-8">
                        <Database className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Create Your Account
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Join thousands of users querying databases with natural language
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="John Doe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
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
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
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
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1 accent-indigo-500"
                                />
                                <span>
                                    I agree to the Terms of Service and Privacy Policy
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-60"
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-6 border-t text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-indigo-500 font-semibold hover:text-purple-600"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>

                {/* Right Side */}
                <div className="hidden md:block text-white">
                    <h2 className="text-4xl font-bold mb-8 leading-tight">
                        Why Join Us?
                    </h2>
                    <ul className="space-y-6 text-lg">
                        <li>✓ No credit card required</li>
                        <li>✓ Free trial for 14 days</li>
                        <li>✓ Connect unlimited databases</li>
                        <li>✓ Enterprise security</li>
                        <li>✓ 24/7 customer support</li>
                    </ul>
                </div>

            </div>
        </div>
    )
}
