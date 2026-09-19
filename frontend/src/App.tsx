import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DiseaseDetector } from './components/DiseaseDetector';
import { HowItWorks } from './components/HowItWorks';
import { DiseaseLibrary } from './components/DiseaseLibrary';
import { Marketplace } from './components/Marketplace';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { checkServerHealth } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('detector');
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  useEffect(() => {
    // Initial health check against Python Flask backend
    checkServerHealth().then((isOk) => setServerOnline(isOk));
    const interval = setInterval(() => {
      checkServerHealth().then((isOk) => setServerOnline(isOk));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectSample = (filename: string) => {
    setSelectedSample(filename);
    setActiveTab('detector');
    const detectorElem = document.getElementById('detector');
    if (detectorElem) {
      detectorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDetector = () => {
    setActiveTab('detector');
    const detectorElem = document.getElementById('detector');
    if (detectorElem) {
      detectorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverOnline={serverOnline}
      />

      <main className="flex-grow">
        {activeTab === 'detector' && (
          <>
            <Hero
              onStartDiagnosis={scrollToDetector}
              onSelectSample={handleSelectSample}
            />
            <DiseaseDetector
              initialSample={selectedSample}
              onClearSample={() => setSelectedSample(null)}
              onGoToMarket={() => setActiveTab('market')}
            />
            <HowItWorks />
          </>
        )}

        {activeTab === 'library' && (
          <div className="pt-24">
            <DiseaseLibrary />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="pt-24">
            <Marketplace />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-24">
            <Contact />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}

export default App;
