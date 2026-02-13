import React from 'react'
import { X, Copy, Download } from 'lucide-react'

function QueryResult({ result, onClose }) {
    const handleCopySQL = () => {
        navigator.clipboard.writeText(result.sql)
        alert('SQL copied to clipboard!')
    }

    const handleDownloadCSV = () => {
        const headers = result.columns.join(',')
        const rows = result.rows
            .map(row => result.columns.map(col => JSON.stringify(row[col])).join(','))
            .join('\n')
        const csv = `${headers}\n${rows}`
        const element = document.createElement('a')
        element.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
        element.download = `query-result-${Date.now()}.csv`
        element.click()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-lg max-w-[90%] max-h-[90vh] w-[900px] flex flex-col overflow-hidden animate-slideIn">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Query Result</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SQL Query */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                        SQL Query
                    </span>
                    <div className="relative bg-white border border-gray-300 rounded-md p-3 font-mono text-xs overflow-x-auto">
                        <code>{result.sql}</code>
                        <button
                            onClick={handleCopySQL}
                            className="absolute top-2 right-2 p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                            title="Copy SQL"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                {/* Results Table */}
                <div className="flex-1 overflow-auto p-4 border-b border-gray-200 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase text-gray-500">
                        Results ({result.rows.length} row{result.rows.length !== 1 ? 's' : ''})
                    </span>
                    <table className="w-full table-auto border border-gray-300 rounded-md text-sm">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                {result.columns.map(col => (
                                    <th
                                        key={col}
                                        className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-300"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.rows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {result.columns.map(col => (
                                        <td
                                            key={`${idx}-${col}`}
                                            className="px-3 py-2 border-b border-gray-200 break-words max-w-[200px]"
                                        >
                                            {typeof row[col] === 'object'
                                                ? JSON.stringify(row[col])
                                                : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 p-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        <Download size={16} />
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QueryResult
