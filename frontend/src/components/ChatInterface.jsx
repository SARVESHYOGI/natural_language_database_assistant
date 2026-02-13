import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader } from 'lucide-react'

function ChatInterface({ messages, isLoading, onSendMessage }) {
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input)
            setInput('')
            inputRef.current?.focus()
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm m-5 overflow-hidden">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">

                {messages.map((msg) => {
                    const isUser = msg.role === 'user'

                    return (
                        <div
                            key={msg.id}
                            className={`flex flex-col gap-1 animate-slideIn ${isUser ? 'items-end' : 'items-start'
                                }`}
                        >
                            <div
                                className={`
                  max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed break-words
                  ${isUser
                                        ? 'bg-blue-500 text-white rounded-br-md'
                                        : 'bg-gray-200 text-gray-800 rounded-bl-md'
                                    }
                `}
                            >
                                <div className="mb-2 whitespace-pre-wrap">
                                    {msg.content}
                                </div>

                                {msg.isProcessing && (
                                    <div className="text-xs flex items-center gap-2 opacity-80">
                                        <Loader size={14} className="animate-spin" />
                                        Processing...
                                    </div>
                                )}

                                {msg.executed && (
                                    <div className="text-xs opacity-80">
                                        ✓ Query executed
                                    </div>
                                )}
                            </div>

                            <span className="text-[11px] text-gray-400 px-1">
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    )
                })}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-gray-50 px-6 py-4">

                <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-lg p-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">

                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask a question about your database..."
                        disabled={isLoading}
                        rows={1}
                        className="flex-1 resize-none outline-none text-sm bg-transparent max-h-32 placeholder-gray-400 disabled:opacity-60"
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        aria-label="Send message"
                        className={`
              flex items-center justify-center
              w-9 h-9 rounded-md text-white
              transition transform
              ${isLoading || !input.trim()
                                ? 'bg-gray-300 cursor-not-allowed opacity-60'
                                : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                            }
            `}
                    >
                        {isLoading ? (
                            <Loader size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>

                </div>

                <p className="text-xs text-gray-500 mt-2 text-right">
                    Press Enter to send, Shift+Enter for new line
                </p>

            </div>
        </div>
    )
}

export default ChatInterface
