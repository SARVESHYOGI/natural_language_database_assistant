import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Database, Plus, Settings, X } from 'lucide-react'
import DatabaseSelector from '../components/DatabaseSelector'
import ChatInterface from '../components/ChatInterface'
import QueryResult from '../components/QueryResult'
import PermissionModal from '../components/PermissionModal'
import api from '../api/axios'

export default function DashboardPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [selectedDatabase, setSelectedDatabase] = useState(null)
    const [isAddDatabaseOpen, setIsAddDatabaseOpen] = useState(false)
    const [databases, setDatabases] = useState([
        { id: 'ecom', name: 'E-Commerce Database', tables: ['users', 'products', 'orders'] },
        { id: 'school', name: 'School Database', tables: ['students', 'courses', 'enrollments'] },
        { id: 'crm', name: 'CRM Database', tables: ['contacts', 'companies', 'deals'] },
    ])
    const [newDatabaseName, setNewDatabaseName] = useState('');
    useEffect(() => {
        const fetchDateBase = async () => {
            try {
                const res = await api.get('/db/databases')
                console.log(res);
                setDatabases(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchDateBase();
    }, [])

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content:
                'Welcome to the Natural Language Database Assistant! Select a database to start querying with natural language.',
            timestamp: new Date(),
        },
    ])

    const [isLoading, setIsLoading] = useState(false)
    const [queryResult, setQueryResult] = useState(null)
    const [permissionRequest, setPermissionRequest] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me')
                console.log(res);
                setUser(res.data)
            } catch (err) {
                console.log(err);
                navigate('/login')
            }
        }

        fetchUser()
    }, [navigate])

    const handleLogout = async () => {
        await api.post('/auth/logout')
        navigate('/login')
    }

    const handleDatabaseSelect = (db) => {
        setSelectedDatabase(db)
        setMessages([
            {
                id: 1,
                role: 'assistant',
                content: `Connected to ${db.name}. You can now ask questions about this database.`,
                timestamp: new Date(),
            },
        ])
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-indigo-600 text-lg">
                Loading...
            </div>
        )
    }

    const addDB = async () => {
        if (!newDatabaseName.trim()) return;

        try {
            const res = await api.post('/db/databases', { name: newDatabaseName });
            const createdDb = res.data;
            setDatabases((prev) => [...prev, createdDb]);
            setNewDatabaseName('');
            setIsAddDatabaseOpen(false);
        } catch (err) {
            console.error('Failed to add database', err);
            alert('Error creating database. Please try again.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* HEADER */}
            <header className="bg-white border-b shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Left */}
                <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-xl font-semibold text-gray-800">
                        NL Database Assistant
                    </h1>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-3">

                    <button
                        onClick={() => setIsAddDatabaseOpen(true)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Database</span>
                    </button>

                    <button className="bg-gray-100 hover:bg-indigo-600 hover:text-white p-2 rounded-lg transition">
                        <Settings size={18} />
                    </button>

                    <div className="hidden md:flex items-center gap-2 px-4 border-x text-sm font-medium text-gray-700">
                        <User size={18} className="text-indigo-600" />
                        {user.username}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-lg transition"
                    >
                        <LogOut size={18} />
                    </button>

                </div>
            </header>

            {isAddDatabaseOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50
               bg-black bg-opacity-30 backdrop-blur-sm"
                >
                    <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
                        <button
                            onClick={() => setIsAddDatabaseOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Add New Database</h2>

                        <input
                            type="text"
                            placeholder="Database Name"
                            className="w-full p-2 border rounded mb-4"
                            value={newDatabaseName}
                            onChange={(e) => setNewDatabaseName(e.target.value)}
                        />

                        <button
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                            onClick={addDB}
                        >
                            Add Database
                        </button>
                    </div>
                </div>
            )}

            {/* CONTENT */}
            <div className="flex-1 grid lg:grid-cols-[260px_1fr] gap-4 p-4">

                {/* Sidebar */}
                <aside className="bg-white rounded-xl shadow-sm p-4 overflow-y-auto">
                    <DatabaseSelector
                        databases={databases}
                        selectedDatabase={selectedDatabase}
                        onSelect={handleDatabaseSelect}
                    />
                </aside>

                {/* Main */}
                <main className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">

                    {selectedDatabase ? (
                        <>
                            <ChatInterface
                                messages={messages}
                                isLoading={isLoading}
                                onSendMessage={() => { }}
                            />

                            {queryResult && (
                                <QueryResult
                                    result={queryResult}
                                    onClose={() => setQueryResult(null)}
                                />
                            )}

                            {permissionRequest && (
                                <PermissionModal
                                    request={permissionRequest}
                                    onApprove={() => { }}
                                    onCancel={() => { }}
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                Select a Database
                            </h2>
                            <p>Choose a database from the sidebar to start querying</p>
                        </div>
                    )}

                </main>

            </div>
        </div>
    )
}
