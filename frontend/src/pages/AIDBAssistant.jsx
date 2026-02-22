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
    const [databases, setDatabases] = useState([])
    const [selectedDatabase, setSelectedDatabase] = useState(null)
    const [isAddDatabaseOpen, setIsAddDatabaseOpen] = useState(false)
    const [newDatabaseName, setNewDatabaseName] = useState('')

    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [queryResult, setQueryResult] = useState(null)
    const [permissionRequest, setPermissionRequest] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth/me')
                setUser(res.data)
            } catch (err) {
                console.log(err);
                navigate('/login')
            }
        }
        fetchUser()
    }, [navigate])

    useEffect(() => {
        const fetchDatabases = async () => {
            try {
                const res = await api.get('/databases')
                setDatabases(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchDatabases()
    }, [])

    /* ---------------- HANDLE SEND MESSAGE ---------------- */
    const handleSendMessage = async (input) => {
        if (!selectedDatabase) return

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMsg])
        setIsLoading(true)

        try {
            const res = await api.post('/query', {
                message: input,
            })

            const data = res.data

            if (data.result?.status === 'confirmation_required') {
                setPermissionRequest({
                    sql: data.result.sql,
                    type: 'Mutation',
                    message: 'This query will modify your database. Do you want to proceed?',
                    originalMessage: input,
                })
            } else {
                const assistantMsg = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: JSON.stringify(data.result, null, 2),
                    timestamp: new Date(),
                    executed: true,
                }

                setMessages((prev) => [...prev, assistantMsg])

                if (Array.isArray(data.result)) {
                    setQueryResult({
                        sql: data.generated_sql,
                        columns: Object.keys(data.result[0] || {}),
                        rows: data.result,
                    })
                }
            }
        } catch (err) {
            console.error(err)
        }

        setIsLoading(false)
    }

    /* ---------------- APPROVE MUTATION ---------------- */
    const handleApprove = async () => {
        try {
            const res = await api.post('/query', {
                message: permissionRequest.originalMessage,
                confirm: true,
            })

            const assistantMsg = {
                id: Date.now(),
                role: 'assistant',
                content: '✅ Query executed successfully.',
                timestamp: new Date(),
                executed: true,
            }

            setMessages((prev) => [...prev, assistantMsg])
            setPermissionRequest(null)
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogout = async () => {
        await api.post('/auth/logout')
        navigate('/login')
    }

    const addDB = async () => {
        if (!newDatabaseName.trim()) return
        try {
            const res = await api.post('/databases', { name: newDatabaseName })
            setDatabases((prev) => [...prev, res.data])
            setNewDatabaseName('')
            setIsAddDatabaseOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    if (!user) return <div className="p-10">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* HEADER */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Database className="text-indigo-600" />
                    <h1 className="font-semibold">NL Database Assistant</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setIsAddDatabaseOpen(true)} className="text-sm bg-gray-100 px-3 py-2 rounded">
                        <Plus size={16} />
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <User size={16} /> {user.username}
                    </div>
                    <button onClick={handleLogout} className="text-red-500">
                        <LogOut size={16} />
                    </button>
                </div>
            </header>
            {isAddDatabaseOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-96 rounded-xl shadow-lg p-6 relative">

                        <button
                            onClick={() => setIsAddDatabaseOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Create New Database</h2>

                        <input
                            type="text"
                            placeholder="Enter database name"
                            value={newDatabaseName}
                            onChange={(e) => setNewDatabaseName(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <button
                            onClick={addDB}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Create Database
                        </button>
                    </div>
                </div>
            )}
            {/* CONTENT */}
            <div className="flex-1 grid grid-cols-[260px_1fr] gap-4 p-4">
                <aside className="bg-white rounded p-4">
                    <DatabaseSelector
                        databases={databases}
                        selectedDatabase={selectedDatabase}
                        onSelect={setSelectedDatabase}
                    />
                </aside>

                <main className="bg-white rounded flex flex-col">
                    {selectedDatabase ? (
                        <>
                            <ChatInterface
                                messages={messages}
                                isLoading={isLoading}
                                onSendMessage={handleSendMessage}
                            />

                            {queryResult && (
                                <QueryResult result={queryResult} onClose={() => setQueryResult(null)} />
                            )}

                            {permissionRequest && (
                                <PermissionModal
                                    request={permissionRequest}
                                    onApprove={handleApprove}
                                    onCancel={() => setPermissionRequest(null)}
                                />
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-500">
                            Select a database to start querying
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
