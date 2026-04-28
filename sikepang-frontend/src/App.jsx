import { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PetaniPage from './pages/PetaniPage';
import KomoditasPage from './pages/KomoditasPage';
import StokPage from './pages/StokPage';
import DistribusiPage from './pages/DistribusiPage';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'dashboard'
  const [activePage, setActivePage] = useState('dashboard');

  // If user is on the landing page, show it
  if (view === 'landing') {
    return <LandingPage onEnterDashboard={() => setView('dashboard')} />;
  }

  // Otherwise show dashboard layout
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'petani': return <PetaniPage />;
      case 'komoditas': return <KomoditasPage />;
      case 'stok': return <StokPage />;
      case 'distribusi': return <DistribusiPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plantation-50 via-white to-leaf-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-plantation-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-leaf-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-plantation-100/20 rounded-full blur-3xl" />
      </div>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="lg:ml-[280px] min-h-screen relative">
        <div className="p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
