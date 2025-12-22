import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bookingApi } from '@services/api';
import './BookingsPage.scss';

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

type TabType = 'upcoming' | 'past';

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [allBookings, setAllBookings] = useState<PackageBooking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<PackageBooking[]>([]);
  const [pastBookings, setPastBookings] = useState<PackageBooking[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (allBookings.length > 0) {
      categorizeBookings();
    }
  }, [allBookings]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingApi.getUserBookings();
      setAllBookings(response.package_booking || []);
    } catch (err: any) {
      console.error('Failed to load bookings:', err);
      setError(err.message || t('bookings.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const categorizeBookings = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming: PackageBooking[] = [];
    const past: PackageBooking[] = [];

    allBookings.forEach(booking => {
      const endDate = new Date(booking.package_end_date);
      endDate.setHours(0, 0, 0, 0);

      if (endDate >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    });

    setUpcomingBookings(upcoming);
    setPastBookings(past);
  };

  const handlePackageClick = (booking: PackageBooking) => {
    navigate(`/classes/${booking.transaction_id}`);
  };

  const getPackageName = (booking: PackageBooking): string => {
    return isRTL ? booking.package_name_ar : booking.package_name;
  };

  const getClassName = (classBooking: ClassBooking): string => {
    return isRTL ? classBooking.class_name_ar : classBooking.class_name;
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(i18n.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    return timeStr;
  };

  const getDisplayBookings = (): PackageBooking[] => {
    return activeTab === 'upcoming' ? upcomingBookings : pastBookings;
  };

  const getRemainingClasses = (booking: PackageBooking): number => {
    return booking.class_limit - booking.total_bookings;
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-page__header">
          <h1 className="bookings-page__title">{t('bookings.title')}</h1>
        </div>
        <div className="bookings-page__loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookings-page">
        <div className="bookings-page__header">
          <h1 className="bookings-page__title">{t('bookings.title')}</h1>
        </div>
        <div className="bookings-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="bookings-page" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bookings-page__header">
        <h1 className="bookings-page__title">{t('bookings.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="bookings-page__tabs">
        <button
          className={`bookings-page__tab ${activeTab === 'upcoming' ? 'bookings-page__tab--active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          {t('bookings.upcoming')} ({upcomingBookings.length})
        </button>
        <button
          className={`bookings-page__tab ${activeTab === 'past' ? 'bookings-page__tab--active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          {t('bookings.past')} ({pastBookings.length})
        </button>
      </div>

      {/* Content */}
      <div className="bookings-page__content">
        {getDisplayBookings().length === 0 ? (
          <div className="bookings-page__empty">
            <p>
              {activeTab === 'upcoming'
                ? t('bookings.noUpcomingBookings')
                : t('bookings.noPastBookings')}
            </p>
          </div>
        ) : (
          <div className="booking-list">
            {getDisplayBookings().map(booking => (
              <div
                key={booking.transaction_id}
                className="booking-card"
                onClick={() => handlePackageClick(booking)}
              >
                {/* Package Header */}
                <div className="booking-card__header">
                  <div className="booking-card__package-info">
                    <h3 className="booking-card__package-name">
                      {getPackageName(booking)}
                    </h3>
                    <p className="booking-card__session">{booking.package_session}</p>
                  </div>
                  <div className="booking-card__status">
                    {activeTab === 'upcoming' && getRemainingClasses(booking) > 0 && (
                      <span className="booking-card__badge booking-card__badge--active">
                        {t('bookings.active')}
                      </span>
                    )}
                    {activeTab === 'past' && (
                      <span className="booking-card__badge booking-card__badge--completed">
                        {t('bookings.completed')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Package Details */}
                <div className="booking-card__details">
                  <div className="booking-card__detail">
                    <span className="booking-card__label">{t('bookings.bookedClasses')}</span>
                    <span className="booking-card__value">
                      {booking.total_bookings} / {booking.class_limit}
                    </span>
                  </div>

                  <div className="booking-card__detail">
                    <span className="booking-card__label">{t('bookings.remaining')}</span>
                    <span className="booking-card__value">{getRemainingClasses(booking)}</span>
                  </div>

                  <div className="booking-card__detail">
                    <span className="booking-card__label">{t('bookings.validUntil')}</span>
                    <span className="booking-card__value">
                      {formatDate(booking.package_end_date)}
                    </span>
                  </div>
                </div>

                {/* Scheduled Classes */}
                {booking.class_bookings && booking.class_bookings.length > 0 && (
                  <div className="booking-card__classes">
                    <h4 className="booking-card__classes-title">
                      {t('bookings.scheduledClasses')} ({booking.class_bookings.length})
                    </h4>
                    <div className="class-list">
                      {booking.class_bookings.slice(0, 3).map(classBooking => (
                        <div key={classBooking.id} className="class-item">
                          <div className="class-item__info">
                            <span className="class-item__name">
                              {getClassName(classBooking)}
                            </span>
                            <span className="class-item__date">
                              {formatDate(classBooking.class_date)}
                            </span>
                          </div>
                          <div className="class-item__time">
                            {formatTime(classBooking.from_time)} - {formatTime(classBooking.to_time)}
                          </div>
                        </div>
                      ))}
                      {booking.class_bookings.length > 3 && (
                        <div className="class-item class-item--more">
                          +{booking.class_bookings.length - 3} {t('bookings.moreClasses')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Details Arrow */}
                <div className="booking-card__arrow">
                  {isRTL ? '←' : '→'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
