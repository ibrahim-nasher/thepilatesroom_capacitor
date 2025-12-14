import React from 'react';
import { useParams } from 'react-router-dom';

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  
  return (
    <div>
      <h2>Booking Detail</h2>
      <p>Booking ID: {bookingId}</p>
    </div>
  );
};

export default BookingDetailPage;
