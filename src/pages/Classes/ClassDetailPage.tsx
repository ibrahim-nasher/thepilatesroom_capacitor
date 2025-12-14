import React from 'react';
import { useParams } from 'react-router-dom';

const ClassDetailPage: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  
  return (
    <div>
      <h2>Class Detail</h2>
      <p>Schedule ID: {scheduleId}</p>
    </div>
  );
};

export default ClassDetailPage;
