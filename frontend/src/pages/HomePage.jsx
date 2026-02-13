import React from 'react'
import { Link } from 'react-router-dom'
import { Database, MessageSquare, Lock, Zap } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">

            {/* Navbar */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <Database className="w-8 h-8" />
                        <span>NL Database Assistant</span>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-5 py-2 rounded-lg font-medium hover:bg-white hover:text-indigo-500 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-medium hover:-translate-y-1 hover:shadow-lg transition"
                        >
                            Register
                        </Link>
                    </div>

                </div>
            </nav>

            <main className="flex-1 flex flex-col">

                {/* Hero Section */}
                <section className="max-w-7xl mx-auto w-full px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

                    <div className="text-white">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                            Query Your Databases with Natural Language
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            No SQL knowledge required. Just ask in plain English and get instant results from your databases.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:-translate-y-1 hover:shadow-lg transition"
                            >
                                Get Started Free
                            </Link>

                            <Link
                                to="/login"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-white/10 rounded-2xl p-16 flex items-center justify-center text-white">
                            <MessageSquare className="w-28 h-28 opacity-80" />
                        </div>
                    </div>

                </section>

                {/* Features Section */}
                <section className="bg-white py-20 px-6 text-center">
                    <h2 className="text-4xl font-bold mb-16 text-gray-800">
                        Why Choose NL Database Assistant?
                    </h2>

                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                        {/* Feature 1 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition">
                            <MessageSquare className="w-14 h-14 text-indigo-500 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                Natural Language Queries
                            </h3>
                            <p className="text-gray-600">
                                Ask questions in plain English. No SQL required. Our AI understands your intent.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition">
                            <Database className="w-14 h-14 text-indigo-500 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                Multi-Database Support
                            </h3>
                            <p className="text-gray-600">
                                Connect and query multiple databases seamlessly from a single interface.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition">
                            <Lock className="w-14 h-14 text-indigo-500 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                Permission-Based Security
                            </h3>
                            <p className="text-gray-600">
                                Control who can execute which queries with role-based permission gates.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-gray-50 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-xl transition">
                            <Zap className="w-14 h-14 text-indigo-500 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">
                                Instant Results
                            </h3>
                            <p className="text-gray-600">
                                Get real-time query results and export data in multiple formats.
                            </p>
                        </div>

                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-gray-100 py-20 px-6 text-center">
                    <h2 className="text-4xl font-bold mb-16 text-gray-800">
                        How It Works
                    </h2>

                    <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 items-center">

                        {[
                            { step: 1, title: "Sign Up", desc: "Create your free account in seconds" },
                            { step: 2, title: "Connect Database", desc: "Link your databases to the platform" },
                            { step: 3, title: "Ask Questions", desc: "Query in natural language instantly" },
                            { step: 4, title: "Get Results", desc: "View and export your data" }
                        ].map((item) => (
                            <div key={item.step} className="bg-white p-8 rounded-2xl shadow-sm">
                                <div className="w-14 h-14 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}

                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20 px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Transform Your Data Queries?
                    </h2>
                    <p className="text-lg opacity-90 mb-10">
                        Join thousands of users already using NL Database Assistant
                    </p>

                    <Link
                        to="/register"
                        className="bg-white text-indigo-600 px-10 py-4 rounded-lg font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition"
                    >
                        Start Your Free Trial Today
                    </Link>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-black/20 text-white text-center py-6 border-t border-white/10">
                © 2024 NL Database Assistant. All rights reserved.
            </footer>
        </div>
    )
}
