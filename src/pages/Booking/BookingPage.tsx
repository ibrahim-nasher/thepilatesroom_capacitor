import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '../../services/api/bookings';
import type { ClassSchedule } from '../../services/api/classes';
import './BookingPage.scss';

interface ActivePackage {
  id: string;
  package_name: string;
  package_session: string;
  total_bookings: number;
  class_limit: number;
  category_id: string;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const classSchedule = location.state?.classSchedule as ClassSchedule | null;
  
  const [activePackages, setActivePackages] = useState<ActivePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select-package' | 'confirm'>('select-package');

  useEffect(() => {
    if (!classSchedule) {
      navigate(-1);
      return;
    }
    loadActivePackages();
  }, [classSchedule, navigate]);

  const loadActivePackages = async () => {
    try {
      setLoading(true);
      const packages = await bookingApi.getActivePackages();
      setActivePackages(packages);
      
      // Auto-select if only one package
      if (packages.length === 1) {
        setSelectedPackage(packages[0].id);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
      setError(t('booking.failedToLoadPackages'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setError(null);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      setError(t('booking.pleaseSelectPackage'));
      return;
    }
    setStep('confirm');
  };

  const handleConfirmBooking = async () => {
    if (!classSchedule || !selectedPackage) return;

    try {
      setLoading(true);
      setError(null);

      const selectedPkg = activePackages.find(p => p.id === selectedPackage);
      if (!selectedPkg) {
        setError(t('booking.packageNotFound'));
        return;
      }

      // Convert date to DD/MM/YYYY format
      const [year, month, day] = classSchedule.date.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      // Check availability first
      const availability = await bookingApi.checkBookingAvailability({
        bookings: [{
          class_id: parseInt(classSchedule.class_id),
          class_schedule_id: parseInt(classSchedule.id),
          class_date: formattedDate,
        }],
        booking_type: 'individual',
      });

      if (!availability.status) {
        setError(availability.message || t('booking.classNotAvailable'));
        return;
      }

      // Create booking
      const bookingData = {
        bookings: [{
          class_id: parseInt(classSchedule.class_id),
          class_schedule_id: parseInt(classSchedule.id),
          class_date: formattedDate,
        }],
        booking_type: 'individual' as const,
        package_id: selectedPackage,
        category_id: selectedPkg.category_id,
        session_id: '3', // Default session (1 hour)
        send_reminder: true,
      };

      const response = await bookingApi.addBooking(bookingData);

      if (response.status) {
        // Success - navigate back with success state
        navigate('/', { state: { bookingSuccess: true } });
      } else {
        setError(response.message || t('booking.bookingFailed'));
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.message || t('booking.bookingFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('select-package');
      setError(null);
    } else {
      navigate(-1);
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!classSchedule) return null;

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="booking-page__header">
        <button className="booking-page__back" onClick={handleBack}>
          ←
        </button>
        <h2 className="booking-page__title">
          {step === 'select-package' ? t('booking.selectPackage') : t('booking.confirmBooking')}
        </h2>
        <button className="booking-page__close" onClick={() => navigate(-1)}>
          ×
        </button>
      </div>

      <div className="booking-page__content">
        {/* Class Details */}
        <div className="booking-page__class-details">
          <h3 className="booking-page__class-name">{classSchedule.class_name}</h3>
          <div className="booking-page__class-info">
            <p className="booking-page__date">{formatDate(classSchedule.date)}</p>
            <p className="booking-page__time">{formatTime(classSchedule.time)}</p>
            <p className="booking-page__instructor">
              {t('booking.instructor')}: {classSchedule.instructor_name}
            </p>
            <p className="booking-page__duration">
              {t('booking.duration')}: {classSchedule.duration} {t('booking.minutes')}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="booking-page__error">
            {error}
          </div>
        )}

        {/* Step 1: Select Package */}
        {step === 'select-package' && (
          <div className="booking-page__packages">
            {loading ? (
              <div className="booking-page__loading">{t('common.loading')}</div>
            ) : activePackages.length === 0 ? (
              <div className="booking-page__no-packages">
                <p>{t('booking.noActivePackages')}</p>
                <p className="booking-page__no-packages-hint">
                  {t('booking.purchasePackageHint')}
                </p>
              </div>
            ) : (
              <>
                <p className="booking-page__packages-label">{t('booking.choosePackage')}</p>
                {activePackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`booking-page__package ${selectedPackage === pkg.id ? 'booking-page__package--selected' : ''}`}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <div className="booking-page__package-info">
                      <h4 className="booking-page__package-name">{pkg.package_name}</h4>
                      <p className="booking-page__package-session">{pkg.package_session}</p>
                      <p className="booking-page__package-credits">
                        {pkg.total_bookings} / {pkg.class_limit} {t('booking.creditsRemaining')}
                      </p>
                    </div>
                    {selectedPackage === pkg.id && (
                      <span className="booking-page__package-check">✓</span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 'confirm' && selectedPackage && (
          <div className="booking-page__confirmation">
            <div className="booking-page__confirm-details">
              <p className="booking-page__confirm-label">{t('booking.selectedPackage')}:</p>
              <p className="booking-page__confirm-value">
                {activePackages.find(p => p.id === selectedPackage)?.package_name}
              </p>
            </div>
            <p className="booking-page__confirm-note">
              {t('booking.confirmationNote')}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="booking-page__actions">
        {step === 'select-package' ? (
          <>
            <button 
              className="booking-page__button booking-page__button--secondary"
              onClick={() => navigate(-1)}
            >
              {t('common.cancel')}
            </button>
            <button 
              className="booking-page__button booking-page__button--primary"
              onClick={handleContinue}
              disabled={!selectedPackage || loading || activePackages.length === 0}
            >
              {t('common.continue')}
            </button>
          </>
        ) : (
          <>
            <button 
              className="booking-page__button booking-page__button--secondary"
              onClick={handleBack}
              disabled={loading}
            >
              {t('common.back')}
            </button>
            <button 
              className="booking-page__button booking-page__button--primary"
              onClick={handleConfirmBooking}
              disabled={loading}
            >
              {loading ? t('common.booking') : t('booking.confirmBook')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
