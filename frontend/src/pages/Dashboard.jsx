import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, ArrowRight, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const [rfps, setRfps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRfps = async () => {
            try {
                const res = await api.get('/rfp');
                setRfps(res.data);
            } catch (error) {
                console.error("Failed to fetch RFPs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRfps();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-slate-400 mt-1">Overview of your procurement activities</p>
                </div>
                <Link to="/create-rfp" className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Create New RFP
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rfps.map((rfp) => (
                        <div key={rfp.id} className="card hover:border-indigo-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${rfp.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                                        rfp.status === 'closed' ? 'bg-green-500/20 text-green-400' :
                                            'bg-slate-700 text-slate-300'
                                    }`}>
                                    {rfp.status.toUpperCase()}
                                </div>
                                <span className="text-xs text-slate-500">
                                    {new Date(rfp.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {rfp.title}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                {rfp.originalPrompt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div className="text-sm text-slate-400">
                                    {rfp.structuredData?.items?.length || 0} Items
                                </div>
                                <Link to={`/rfp/${rfp.id}`} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                                    View Details <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {rfps.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            <p className="text-slate-400 mb-4">No RFPs found. Start by creating one.</p>
                            <Link to="/create-rfp" className="btn-secondary inline-flex items-center gap-2">
                                <Plus size={18} /> Create First RFP
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
