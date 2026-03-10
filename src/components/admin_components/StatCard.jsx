import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, link }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-navy-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-navy-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-navy-900">
                        {value}
                    </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                    <Icon size={28} />
                </div>
            </div>

            {link && (
                <div className="mt-4 flex items-center text-xs font-medium text-navy-400 group-hover:text-blue-600 transition-colors">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default StatCard;
