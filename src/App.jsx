import { useState } from 'react';
import Landing from './pages/Landing';
import Studio from './pages/Studio';

export default function App() {
  const [page, setPage] = useState('landing');

  return page === 'landing'
    ? <Landing onStart={() => setPage('studio')} />
    : <Studio onNavigateHome={() => setPage('landing')} />;
}
