import { useState } from 'react';
import Landing from './pages/Landing';
import Studio from './pages/Studio';
import SubscriptionModal from './components/ui/SubscriptionModal';

export default function App() {
  const [page, setPage]             = useState('landing');
  // Show modal on every visit — set to false once dismissed or subscribed
  const [showSub, setShowSub]       = useState(true);

  const handleSubscribe = (planId) => {
    setShowSub(false);
  };

  const handleDismiss = () => {
    setShowSub(false);
  };

  return (
    <>
      {page === 'landing'
        ? <Landing onStart={() => setPage('studio')} />
        : <Studio onNavigateHome={() => setPage('landing')} />
      }

      {showSub && (
        <SubscriptionModal
          onClose={handleDismiss}
          onSubscribe={handleSubscribe}
        />
      )}
    </>
  );
}
