import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  return <Navigate to="/sales-tracker" replace />;
};

export default Index;