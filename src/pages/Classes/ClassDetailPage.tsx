import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '@services/api';
import './ClassDetailPage.scss';

interface ClassBooking {
  id: string;
  class_date: string;
  day: string;
  from_time: string;
  to_time: string;
  class_name: string;
  class_name_ar: string;
  seat_capacity: number;
  instructor_name: string;
}

interface PackageBooking {
  id: string;
  transaction_id: string;
  package_name: string;
  package_name_ar: string;
  package_session: string;
  package_type: number;
  category_id: string;
  total_bookings: number;
  class_limit: number;
  package_start_date: string;
  package_end_date: string;
  booking_type: string;
  class_bookings: ClassBooking[];
}

const ClassDetailPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packageBooking, setPackageBooking] = useState<PackageBooking | null>(null);

  useEffect(() => {
    loadPackageDetails();
  }, [transactionId]);

  const loadPackageDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all user bookings and find the one with matching transaction_id
      const response = await bookingApi.getUserBookings();
      const booking = response.package_booking.find(
        (b) => b.transaction_id === transactionId
      );

      if (booking) {
        setPackageBooking(booking);
      } else {
        setError(t('classDetail.notFound'));
      }
    } catch (err: any) {
      console.error('Failed to load package details:', err);
      setError(err.message || t('classDetail.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    // Assuming time is in HH:MM format
    return timeStr;
  };

  const getPackageName = (): string => {
    if (!packageBooking) return '';
    return isRTL ? packageBooking.package_name_ar : packageBooking.package_name;
  };

  const getClassName = (classBooking: ClassBooking): string => {
    return isRTL ? classBooking.class_name_ar : classBooking.class_name;
  };

  const getUnbookedClasses = (): number => {
    if (!packageBooking) return 0;
    return packageBooking.class_limit - packageBooking.total_bookings;
  };

  if (loading) {
    return (
      <div className="class-detail">
        <div className="class-detail__header">
          <button className="class-detail__back" onClick={handleBack}>
            {isRTL ? '→' : '←'}
          </button>
          <h1 className="class-detail__title">{t('classDetail.title')}</h1>
        </div>
        <div className="class-detail__loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error || !packageBooking) {
    return (
      <div className="class-detail">
        <div className="class-detail__header">
          <button className="class-detail__back" onClick={handleBack}>
            {isRTL ? '→' : '←'}
          </button>
          <h1 className="class-detail__title">{t('classDetail.title')}</h1>
        </div>
        <div className="class-detail__error">{error || t('classDetail.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="class-detail" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="class-detail__header">
        <button className="class-detail__back" onClick={handleBack}>
          {isRTL ? '→' : '←'}
        </button>
        <h1 className="class-detail__title">{t('classDetail.title')}</h1>
      </div>

      {/* Package Information Card */}
      <div className="class-detail__package-card">
        <div className="package-info">
          <div className="package-info__main">
            <h2 className="package-info__name">{getPackageName()}</h2>
            <p className="package-info__session">{packageBooking.package_session}</p>
            <p className="package-info__type">
              {packageBooking.booking_type === 'individual' 
                ? t('classDetail.individual') 
                : t('classDetail.allClasses')}
            </p>
          </div>

          <div className="package-info__grid">
            {/* Package Type */}
            <div className="info-item">
              <span className="info-item__label">{t('classDetail.package')}</span>
              <span className="info-item__value">{getPackageName()}</span>
            </div>

            {/* Class Balance */}
            <div className="info-item">
              <span className="info-item__label">{t('classDetail.classBalance')}</span>
              <span className="info-item__value">
                {packageBooking.total_bookings} / {packageBooking.class_limit}
              </span>
            </div>

            {/* Date Range */}
            <div className="info-item">
              <span className="info-item__label">{t('classDetail.date')}</span>
              <span className="info-item__value">
                {formatDate(packageBooking.package_start_date)} - {formatDate(packageBooking.package_end_date)}
              </span>
            </div>

            {/* Unbooked Classes */}
            <div className="info-item">
              <span className="info-item__label">{t('classDetail.unbookedClasses')}</span>
              <span className="info-item__value">{getUnbookedClasses()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Classes List */}
      <div className="class-detail__classes">
        <h3 className="class-detail__classes-title">{t('classDetail.scheduledClasses')}</h3>
        
        {packageBooking.class_bookings.length === 0 ? (
          <div className="class-detail__no-classes">
            <p>{t('classDetail.noScheduledClasses')}</p>
          </div>
        ) : (
          <div className="class-list">
            {packageBooking.class_bookings.map((classBooking) => (
              <div key={classBooking.id} className="class-list__item">
                <div className="class-item">
                  <div className="class-item__header">
                    <h4 className="class-item__name">{getClassName(classBooking)}</h4>
                    <span className="class-item__date">{formatDate(classBooking.class_date)}</span>
                  </div>
                  
                  <div className="class-item__details">
                    <div className="class-item__info">
                      <span className="class-item__icon">🕐</span>
                      <span className="class-item__text">
                        {formatTime(classBooking.from_time)} - {formatTime(classBooking.to_time)}
                      </span>
                    </div>
                    
                    <div className="class-item__info">
                      <span className="class-item__icon">👤</span>
                      <span className="class-item__text">{classBooking.instructor_name}</span>
                    </div>
                    
                    <div className="class-item__info">
                      <span className="class-item__icon">📍</span>
                      <span className="class-item__text">
                        {classBooking.seat_capacity} {t('classDetail.seats')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Description */}
      <div className="class-detail__footer">
        <p className="class-detail__note">{t('classDetail.cancelDescription')}</p>
      </div>
    </div>
  );
};

export default ClassDetailPage;
