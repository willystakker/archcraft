import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Studio from './pages/Studio';
import SubscriptionModal from './components/ui/SubscriptionModal';
import useDesignStore from './stores/designStore';

function loadShareData() {
  try {
    const p = new URLSearchParams(window.location.search).get('p');
    if (!p) return null;
    const data = JSON.parse(decodeURIComponent(escape(atob(p))));
    if (!data.v || !Array.isArray(data.r)) return null;
    return data;
  } catch { return null; }
}

export default function App() {
  const [page, setPage]       = useState('landing');
  const [showSub, setShowSub] = useState(true);

  // Load shared project from URL on first render
  useEffect(() => {
    const data = loadShareData();
    if (data) {
      useDesignStore.getState().loadTemplate({
        rooms: data.r,
        furniture: data.f ?? [],
      });
      if (data.n) useDesignStore.getState().setProjectName(data.n);
      if (data.m) useDesignStore.getState().setMaterialTier(data.m);
      // Clean URL so refreshing doesn't reload the share data
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-open studio with the shared design
      setPage('studio');
    }
  }, []);

  return (
    <>
      {page === 'landing'
        ? <Landing
            onStart={() => setPage('studio')}
            onSignIn={() => setShowSub(true)}
          />
        : <Studio onNavigateHome={() => setPage('landing')} />
      }

      {showSub && (
        <SubscriptionModal
          onClose={() => setShowSub(false)}
          onSubscribe={() => setShowSub(false)}
        />
      )}
    </>
  );
}
