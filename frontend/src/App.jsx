import React from 'react';
import Home from './pages/home';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Home />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
