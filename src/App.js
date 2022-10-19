import './App.css';
import React, { Suspense, useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from '../src/routes/dashboard/index.js';
import Layout from "./Layout";
import Monitoring from "./routes/monitoring";
import Transactions from "./routes/transaction";
import Settings from "./routes/settings";
import { profile } from "./actions/auth";
import NotFound from "./routes/notFound";

export const ProfileContext = React.createContext({});

const App = () => {

    const [userData, setUserData] = useState({});
    function hasPermission(path) {
        if (userData?.user?.role === "super admin" || userData?.user?.role === "Super Admin"){
            return true;
        }

        return userData?.user?.permissions.find(permissions => permissions.slug === path);
    };

    useEffect(()=>{
        profile().then(data => setUserData(data));
    },[]);

        return <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <ProfileContext.Provider value={userData}>
                    <Layout>
                        <Routes>
                            <Route path="/" element={hasPermission('dashboard') ? <Dashboard /> : <NotFound/>} />
                            <Route path="/monitoring" element={hasPermission('monitoring') ? <Monitoring /> : <NotFound/>} />
                            <Route path="/transaction" element={hasPermission('transactions') ? <Transactions /> : <NotFound/>} />
                            <Route path="/settings" element={hasPermission('settings') ? <Settings /> : <NotFound/>} />
                            <Route path="/404" element={<NotFound />} />
                        </Routes>
                    </Layout>
                </ProfileContext.Provider>
            </Suspense>
        </Router>
    }
;
export default App;