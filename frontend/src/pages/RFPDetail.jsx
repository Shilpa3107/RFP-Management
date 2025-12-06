import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Send, Check, FileText, BarChart3, Mail } from 'lucide-react';

const RFPDetail = () => {
    const { id } = useParams();
    const [rfp, setRfp] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchRFP();
        fetchVendors();
    }, [id]);

    const fetchRFP = async () => {
        try {
            const res = await api.get(`/rfp/${id}`);
            setRfp(res.data);
        } catch (error) {
            console.error("Failed to fetch RFP", error);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await api.get('/vendors');
            setVendors(res.data);
        } catch (error) {
            console.error("Failed to fetch vendors", error);
        }
    };

    const handleSend = async () => {
        if (selectedVendors.length === 0) return;
        setSending(true);
        try {
            await api.post(`/rfp/${id}/send`, { vendorIds: selectedVendors });
            alert("RFP sent successfully!");
            fetchRFP();
        } catch (error) {
            console.error("Failed to send RFP", error);
            alert("Failed to send RFP");
        } finally {
            setSending(false);
        }
    };

    const toggleVendor = (vendorId) => {
        if (selectedVendors.includes(vendorId)) {
            setSelectedVendors(selectedVendors.filter(id => id !== vendorId));
        } else {
            setSelectedVendors([...selectedVendors, vendorId]);
        }
    };

    if (!rfp) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold text-white">{rfp.title}</h2>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${rfp.status === 'sent' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                            {rfp.status.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-slate-400 max-w-2xl">{rfp.originalPrompt}</p>
                </div>
                <div className="flex gap-3">
                    <Link to={`/rfp/${id}/compare`} className="btn-secondary flex items-center gap-2">
                        <BarChart3 size={20} />
                        Compare Proposals
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RFP Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-400" />
                            Requirements
                        </h3>
                        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 border border-slate-700 overflow-x-auto">
                            <pre>{JSON.stringify(rfp.structuredData, null, 2)}</pre>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Mail size={20} className="text-indigo-400" />
                            Received Proposals ({rfp.Proposals?.length || 0})
                        </h3>
                        {rfp.Proposals?.length > 0 ? (
                            <div className="space-y-4">
                                {rfp.Proposals.map((prop) => (
                                    <div key={prop.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-white">Vendor ID: {prop.vendorId}</span>
                                            <span className="text-xs text-slate-500">{new Date(prop.receivedAt).toLocaleString()}</span>
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            <p>Total Cost: ${prop.parsedData?.totalCost || 'N/A'}</p>
                                            <p>Lead Time: {prop.parsedData?.leadTime || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">No proposals received yet.</p>
                        )}
                    </div>
                </div>

                {/* Vendor Selection */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-white mb-4">Select Vendors</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto mb-6">
                            {vendors.map((vendor) => (
                                <div
                                    key={vendor.id}
                                    onClick={() => toggleVendor(vendor.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedVendors.includes(vendor.id)
                                            ? 'bg-indigo-600/20 border-indigo-500/50'
                                            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-medium text-white">{vendor.name}</p>
                                        <p className="text-xs text-slate-500">{vendor.email}</p>
                                    </div>
                                    {selectedVendors.includes(vendor.id) && <Check size={16} className="text-indigo-400" />}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={sending || selectedVendors.length === 0}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? 'Sending...' : 'Send RFP via Email'}
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RFPDetail;
