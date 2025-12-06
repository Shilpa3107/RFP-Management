import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Sparkles, ArrowRight, Save, Loader2 } from 'lucide-react';

const CreateRFP = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedRFP, setGeneratedRFP] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await api.post('/rfp/generate', { prompt });
            setGeneratedRFP(res.data);
        } catch (error) {
            console.error("Failed to generate RFP", error);
            alert("Failed to generate RFP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedRFP) return;
        try {
            const res = await api.post('/rfp', {
                title: generatedRFP.title,
                originalPrompt: prompt,
                structuredData: generatedRFP,
                status: 'draft'
            });
            navigate(`/rfp/${res.data.id}`);
        } catch (error) {
            console.error("Failed to save RFP", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Create New RFP</h2>
                <p className="text-slate-400 mt-1">Describe your needs, and our AI will structure it for you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="card h-full flex flex-col">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Describe your procurement requirements
                        </label>
                        <textarea
                            className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none min-h-[300px]"
                            placeholder="E.g., I need 20 laptops with 16GB RAM and 15 27-inch monitors. Budget is $50k. Delivery within 30 days..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !prompt}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                Generate Structure
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                    {generatedRFP ? (
                        <div className="card h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">Structured Preview</h3>
                                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">AI Generated</span>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 border border-slate-700">
                                <pre>{JSON.stringify(generatedRFP, null, 2)}</pre>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="btn-primary bg-green-600 hover:bg-green-500 shadow-green-500/20 flex items-center gap-2"
                                >
                                    <Save size={20} />
                                    Save & Continue
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 p-8 text-center">
                            <div>
                                <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                                <p>AI generated structure will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateRFP;
