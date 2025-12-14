import React from 'react';
import { useParams } from 'react-router-dom';

const PackageDetailPage: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  
  return (
    <div>
      <h2>Package Detail</h2>
      <p>Package ID: {packageId}</p>
    </div>
  );
};

export default PackageDetailPage;
