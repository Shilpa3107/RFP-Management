import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Sparkles, Trophy, AlertCircle } from 'lucide-react';

const Comparison = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/rfp/${id}/compare`);
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch comparison", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Generating AI Comparison...</div>;
    if (!data || !data.recommendation) return <div className="p-8 text-center text-slate-500">No proposals to compare yet.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Proposal Comparison</h2>
                <p className="text-slate-400 mt-1">AI-driven analysis and recommendation</p>
            </div>

            {/* Recommendation Card */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
                            <Trophy className="text-white" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white">AI Recommendation</h3>
                    </div>

                    <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
                        {data.recommendation}
                    </p>

                    <div className="bg-slate-900/50 rounded-lg p-4 border border-indigo-500/20">
                        <h4 className="text-sm font-semibold text-indigo-300 mb-2 uppercase tracking-wider">Analysis Summary</h4>
                        <p className="text-slate-300">{data.summary}</p>
                    </div>
                </div>
            </div>

            {/* Scores */}
            {data.scores && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data.scores).map(([vendor, score]) => (
                        <div key={vendor} className="card flex items-center justify-between">
                            <span className="font-medium text-white">{vendor}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${score}%` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-white">{score}/100</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comparison;
