import { Database, Check } from 'lucide-react'

function DatabaseSelector({ databases, selectedDatabase, onSelect }) {
    return (
        <div className="h-full flex flex-col">

            {/* Title */}
            <h3 className="text-xs font-semibold text-gray-600 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Database size={18} />
                Databases
            </h3>

            {/* List */}
            <div className="flex flex-col gap-2 flex-1">

                {databases.map((db) => {
                    const isActive = selectedDatabase?.id === db.id;
                    const tableCount = db.tables?.length || 0;

                    return (
                        <button
                            key={db.id}
                            onClick={() => onSelect(db)}
                            aria-pressed={isActive}
                            className={`
                group flex items-center justify-between p-3 rounded-lg text-left text-sm
                transition-all duration-200 border-2
                ${isActive
                                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                                    : 'bg-gray-100 border-transparent hover:bg-gray-200 hover:translate-x-1'}
            `}
                        >
                            <div className="flex-1 min-w-0">
                                <div className={`font-medium truncate mb-1 ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                                    {db.name}
                                </div>
                                <div className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {tableCount} table{tableCount !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {isActive && <Check size={16} className="text-blue-500 ml-2 flex-shrink-0" />}
                        </button>
                    )
                })}

            </div>
        </div>
    )
}

export default DatabaseSelector
