import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateRFP from './pages/CreateRFP';
import VendorList from './pages/VendorList';
import RFPDetail from './pages/RFPDetail';
import Proposals from './pages/Proposals';
import Comparison from './pages/Comparison';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create-rfp" element={<CreateRFP />} />
                    <Route path="/vendors" element={<VendorList />} />
                    <Route path="/rfp/:id" element={<RFPDetail />} />
                    <Route path="/rfp/:id/compare" element={<Comparison />} />
                    <Route path="/proposals" element={<Proposals />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
