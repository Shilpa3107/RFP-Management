import React, { useState, useEffect } from 'react';
import api from '../api';
import { Inbox, Download, RefreshCw } from 'lucide-react';

const Proposals = () => {
    const [proposals, setProposals] = useState([]);
    const [rfps, setRfps] = useState([]);
    const [vendors, setVendors] = useState([]);

    // Simulation State
    const [simRfpId, setSimRfpId] = useState('');
    const [simVendorId, setSimVendorId] = useState('');
    const [simContent, setSimContent] = useState('');
    const [ingesting, setIngesting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [propRes, rfpRes, vendRes] = await Promise.all([
                api.get('/proposals'),
                api.get('/rfp'),
                api.get('/vendors')
            ]);
            setProposals(propRes.data);
            setRfps(rfpRes.data);
            setVendors(vendRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleSimulateReceive = async () => {
        if (!simRfpId || !simVendorId || !simContent) return;
        setIngesting(true);
        try {
            await api.post('/proposals/ingest', {
                rfpId: simRfpId,
                vendorId: simVendorId,
                emailContent: simContent
            });
            alert("Email received and parsed successfully!");
            setSimContent('');
            fetchData();
        } catch (error) {
            console.error("Failed to ingest proposal", error);
            alert("Failed to ingest proposal");
        } finally {
            setIngesting(false);
        }
    };

    const sampleEmail = `Dear Procurement Team,

We are pleased to submit our proposal for the Laptops and Monitors.

Items:
1. Laptop (16GB RAM) - $1,200 each - Total: $24,000
2. Monitor (27-inch) - $300 each - Total: $4,500

Total Cost: $28,500
Lead Time: 2 weeks
Payment Terms: Net 30
Validity: 30 days

Best regards,
Sales Team`;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Proposals Inbox</h2>
                <p className="text-slate-400 mt-1">Manage and parse incoming vendor responses</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulation Panel */}
                <div className="lg:col-span-1">
                    <div className="card bg-slate-800/50 border-dashed border-indigo-500/30">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Inbox size={20} className="text-indigo-400" />
                            Simulate Incoming Email
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Select RFP</label>
                                <select
                                    className="input-field"
                                    value={simRfpId}
                                    onChange={e => setSimRfpId(e.target.value)}
                                >
                                    <option value="">Select RFP...</option>
                                    {rfps.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">From Vendor</label>
                                <select
                                    className="input-field"
                                    value={simVendorId}
                                    onChange={e => setSimVendorId(e.target.value)}
                                >
                                    <option value="">Select Vendor...</option>
                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label className="block text-sm text-slate-400">Email Content</label>
                                    <button
                                        onClick={() => setSimContent(sampleEmail)}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        Load Sample
                                    </button>
                                </div>
                                <textarea
                                    className="input-field min-h-[200px] font-mono text-sm"
                                    placeholder="Paste email body here..."
                                    value={simContent}
                                    onChange={e => setSimContent(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSimulateReceive}
                                disabled={ingesting || !simRfpId || !simVendorId}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {ingesting ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                                Receive & Parse
                            </button>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-white">Parsed Proposals</h3>
                    {proposals.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
                            No proposals received yet.
                        </div>
                    ) : (
                        proposals.map((prop) => (
                            <div key={prop.id} className="card hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-semibold text-white text-lg">
                                            {prop.Vendor?.name || 'Unknown Vendor'}
                                        </h4>
                                        <p className="text-sm text-slate-400">
                                            Re: {prop.RFP?.title || 'Unknown RFP'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(prop.receivedAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="bg-slate-950 rounded p-4 border border-slate-800 mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Total Cost:</span>
                                        <span className="text-green-400 font-bold">${prop.parsedData?.totalCost}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Lead Time:</span>
                                        <span className="text-white">{prop.parsedData?.leadTime}</span>
                                    </div>
                                </div>

                                <details className="text-sm text-slate-400">
                                    <summary className="cursor-pointer hover:text-indigo-400 transition-colors">View Raw Email</summary>
                                    <pre className="mt-2 p-2 bg-slate-900 rounded overflow-x-auto whitespace-pre-wrap">
                                        {prop.rawContent}
                                    </pre>
                                </details>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Proposals;
