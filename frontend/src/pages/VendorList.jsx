import React, { useEffect, useState } from 'react';
import api from '../api';
import { Plus, Mail, User } from 'lucide-react';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newVendor, setNewVendor] = useState({ name: '', email: '', contactPerson: '' });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await api.get('/vendors');
            setVendors(res.data);
        } catch (error) {
            console.error("Failed to fetch vendors", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vendors', newVendor);
            setShowForm(false);
            setNewVendor({ name: '', email: '', contactPerson: '' });
            fetchVendors();
        } catch (error) {
            console.error("Failed to create vendor", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Vendor Management</h2>
                    <p className="text-slate-400 mt-1">Manage your supplier database</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add Vendor
                </button>
            </div>

            {showForm && (
                <div className="card max-w-2xl animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Add New Vendor</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={newVendor.name}
                                    onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Contact Person</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newVendor.contactPerson}
                                    onChange={e => setNewVendor({ ...newVendor, contactPerson: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm text-slate-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={newVendor.email}
                                    onChange={e => setNewVendor({ ...newVendor, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-primary">Save Vendor</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="card hover:border-slate-600 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                                {vendor.name.charAt(0)}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{vendor.name}</h3>
                        <div className="space-y-2 text-sm text-slate-400 mt-4">
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                {vendor.contactPerson || 'No contact person'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                {vendor.email}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorList;
