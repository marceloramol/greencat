import Layout from "./Layout.jsx";

import SelectProfile from "./SelectProfile";

import Home from "./Home";

import StoreRegister from "./StoreRegister";

import StoreProducts from "./StoreProducts";

import MarketRegister from "./MarketRegister";

import MarketOffers from "./MarketOffers";

import RegiaoBloqueada from "./RegiaoBloqueada";

import SelectCountry from "./SelectCountry";

import SelectState from "./SelectState";

import GlobalAdmin from "./GlobalAdmin";

import ImpactGlobal from "./ImpactGlobal";

import ImpactRegion from "./ImpactRegion";

import ImpactRanking from "./ImpactRanking";

import Onboarding from "./Onboarding";

import LicenciarRegiao from "./LicenciarRegiao";

import OperadorDashboard from "./OperadorDashboard";

import MinhaLicenca from "./MinhaLicenca";

import LandingGlobal from "./LandingGlobal";

import MarketplaceInfo from "./MarketplaceInfo";

import Suporte from "./Suporte";

import OperatorDashboard from "./OperatorDashboard";

import OperatorMarkets from "./OperatorMarkets";

import OperatorOffers from "./OperatorOffers";

import OperatorLicense from "./OperatorLicense";

import SelectRegion from "./SelectRegion";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    SelectProfile: SelectProfile,
    
    Home: Home,
    
    StoreRegister: StoreRegister,
    
    StoreProducts: StoreProducts,
    
    MarketRegister: MarketRegister,
    
    MarketOffers: MarketOffers,
    
    RegiaoBloqueada: RegiaoBloqueada,
    
    SelectCountry: SelectCountry,
    
    SelectState: SelectState,
    
    GlobalAdmin: GlobalAdmin,
    
    ImpactGlobal: ImpactGlobal,
    
    ImpactRegion: ImpactRegion,
    
    ImpactRanking: ImpactRanking,
    
    Onboarding: Onboarding,
    
    LicenciarRegiao: LicenciarRegiao,
    
    OperadorDashboard: OperadorDashboard,
    
    MinhaLicenca: MinhaLicenca,
    
    LandingGlobal: LandingGlobal,
    
    MarketplaceInfo: MarketplaceInfo,
    
    Suporte: Suporte,
    
    OperatorDashboard: OperatorDashboard,
    
    OperatorMarkets: OperatorMarkets,
    
    OperatorOffers: OperatorOffers,
    
    OperatorLicense: OperatorLicense,
    
    SelectRegion: SelectRegion,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<SelectProfile />} />
                
                
                <Route path="/SelectProfile" element={<SelectProfile />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/StoreRegister" element={<StoreRegister />} />
                
                <Route path="/StoreProducts" element={<StoreProducts />} />
                
                <Route path="/MarketRegister" element={<MarketRegister />} />
                
                <Route path="/MarketOffers" element={<MarketOffers />} />
                
                <Route path="/RegiaoBloqueada" element={<RegiaoBloqueada />} />
                
                <Route path="/SelectCountry" element={<SelectCountry />} />
                
                <Route path="/SelectState" element={<SelectState />} />
                
                <Route path="/GlobalAdmin" element={<GlobalAdmin />} />
                
                <Route path="/ImpactGlobal" element={<ImpactGlobal />} />
                
                <Route path="/ImpactRegion" element={<ImpactRegion />} />
                
                <Route path="/ImpactRanking" element={<ImpactRanking />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/LicenciarRegiao" element={<LicenciarRegiao />} />
                
                <Route path="/OperadorDashboard" element={<OperadorDashboard />} />
                
                <Route path="/MinhaLicenca" element={<MinhaLicenca />} />
                
                <Route path="/LandingGlobal" element={<LandingGlobal />} />
                
                <Route path="/MarketplaceInfo" element={<MarketplaceInfo />} />
                
                <Route path="/Suporte" element={<Suporte />} />
                
                <Route path="/OperatorDashboard" element={<OperatorDashboard />} />
                
                <Route path="/OperatorMarkets" element={<OperatorMarkets />} />
                
                <Route path="/OperatorOffers" element={<OperatorOffers />} />
                
                <Route path="/OperatorLicense" element={<OperatorLicense />} />
                
                <Route path="/SelectRegion" element={<SelectRegion />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}