import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '../../services/api/bookings';
import type { ClassSchedule } from '../../services/api/classes';
import './BookingModal.scss';

interface BookingModalProps {
  classSchedule: ClassSchedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ActivePackage {
  id: string;
  package_name: string;
  package_session: string;
  total_bookings: number;
  class_limit: number;
  category_id: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ classSchedule, isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [activePackages, setActivePackages] = useState<ActivePackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select-package' | 'confirm'>('select-package');

  useEffect(() => {
    if (isOpen) {
      loadActivePackages();
    } else {
      // Reset state when closed
      setStep('select-package');
      setSelectedPackage('');
      setError(null);
    }
  }, [isOpen]);

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
        onSuccess();
        onClose();
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
    setStep('select-package');
    setError(null);
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

  if (!isOpen || !classSchedule) return null;

  return (
    <div className="booking-modal">
      <div className="booking-modal__overlay" onClick={onClose}></div>
      <div className="booking-modal__content">
        {/* Header */}
        <div className="booking-modal__header">
          {step === 'confirm' && (
            <button className="booking-modal__back" onClick={handleBack}>
              ←
            </button>
          )}
          <h2 className="booking-modal__title">
            {step === 'select-package' ? t('booking.selectPackage') : t('booking.confirmBooking')}
          </h2>
          <button className="booking-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Class Details */}
        <div className="booking-modal__class-details">
          <h3 className="booking-modal__class-name">{classSchedule.class_name}</h3>
          <div className="booking-modal__class-info">
            <p className="booking-modal__date">{formatDate(classSchedule.date)}</p>
            <p className="booking-modal__time">{formatTime(classSchedule.time)}</p>
            <p className="booking-modal__instructor">
              {t('booking.instructor')}: {classSchedule.instructor_name}
            </p>
            <p className="booking-modal__duration">
              {t('booking.duration')}: {classSchedule.duration} {t('booking.minutes')}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="booking-modal__error">
            {error}
          </div>
        )}

        {/* Step 1: Select Package */}
        {step === 'select-package' && (
          <div className="booking-modal__packages">
            {loading ? (
              <div className="booking-modal__loading">{t('common.loading')}</div>
            ) : activePackages.length === 0 ? (
              <div className="booking-modal__no-packages">
                <p>{t('booking.noActivePackages')}</p>
                <p className="booking-modal__no-packages-hint">
                  {t('booking.pleaseContactAdmin')}
                </p>
              </div>
            ) : (
              <>
                <p className="booking-modal__packages-label">{t('booking.selectPackageLabel')}</p>
                {activePackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`booking-modal__package ${selectedPackage === pkg.id ? 'booking-modal__package--selected' : ''}`}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <div className="booking-modal__package-info">
                      <h4 className="booking-modal__package-name">{pkg.package_name}</h4>
                      <p className="booking-modal__package-session">{pkg.package_session}</p>
                      <p className="booking-modal__package-credits">
                        {pkg.class_limit - pkg.total_bookings} / {pkg.class_limit} {t('booking.creditsRemaining')}
                      </p>
                    </div>
                    {selectedPackage === pkg.id && (
                      <span className="booking-modal__package-check">✓</span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 'confirm' && selectedPackage && (
          <div className="booking-modal__confirmation">
            <div className="booking-modal__confirm-details">
              <p className="booking-modal__confirm-label">{t('booking.usingPackage')}:</p>
              <p className="booking-modal__confirm-value">
                {activePackages.find(p => p.id === selectedPackage)?.package_name}
              </p>
            </div>
            <p className="booking-modal__confirm-note">
              {t('booking.confirmationNote')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="booking-modal__actions">
          {step === 'select-package' ? (
            <>
              <button 
                className="booking-modal__button booking-modal__button--secondary"
                onClick={onClose}
              >
                {t('common.cancel')}
              </button>
              <button 
                className="booking-modal__button booking-modal__button--primary"
                onClick={handleContinue}
                disabled={!selectedPackage || loading || activePackages.length === 0}
              >
                {t('common.continue')}
              </button>
            </>
          ) : (
            <>
              <button 
                className="booking-modal__button booking-modal__button--secondary"
                onClick={handleBack}
                disabled={loading}
              >
                {t('common.back')}
              </button>
              <button 
                className="booking-modal__button booking-modal__button--primary"
                onClick={handleConfirmBooking}
                disabled={loading}
              >
                {loading ? t('common.booking') : t('booking.confirmBook')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
