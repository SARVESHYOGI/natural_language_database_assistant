import React from 'react'
import { AlertTriangle, X, Copy } from 'lucide-react'

function PermissionModal({ request, onApprove, onCancel }) {

    const handleCopySQL = () => {
        navigator.clipboard.writeText(request.sql)
        alert('SQL copied to clipboard!')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-lg overflow-hidden animate-slideUp">

                {/* Header */}
                <div className="relative px-6 py-6 bg-gradient-to-br from-red-500 to-red-600 text-white flex flex-col items-center gap-3 text-center">

                    <AlertTriangle size={24} />

                    <h3 className="text-lg font-semibold">
                        Permission Required
                    </h3>

                    <button
                        onClick={onCancel}
                        aria-label="Close modal"
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 transition p-1 rounded-md"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">

                    <p className="text-gray-700 text-sm leading-relaxed text-center mb-5">
                        {request.message}
                    </p>

                    {/* Badge */}
                    <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold mb-5">
                        {request.type} Operation
                    </div>

                    {/* SQL Section */}
                    <div className="mb-5">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Query to Execute
                        </div>

                        <div className="relative bg-gray-100 border border-gray-200 rounded-md p-3 pr-10 font-mono text-xs overflow-x-auto max-h-28">
                            <code className="text-gray-700 whitespace-pre break-all">
                                {request.sql}
                            </code>

                            <button
                                onClick={handleCopySQL}
                                title="Copy SQL"
                                className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 transition text-white p-1.5 rounded"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="text-sm font-semibold text-red-800 mb-2">
                            ⚠️ Be Careful
                        </div>

                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• This operation will modify your database</li>
                            <li>• Changes cannot be easily undone</li>
                            <li>• Make sure you understand the query</li>
                        </ul>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 py-5 border-t bg-gray-50">

                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-md transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onApprove}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition transform hover:-translate-y-0.5"
                    >
                        Approve & Execute
                    </button>

                </div>
            </div>
        </div>
    )
}

export default PermissionModal
