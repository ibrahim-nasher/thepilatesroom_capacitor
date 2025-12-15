import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { classApi, type ClassSchedule, type Category } from '../services/api/classes';
import { bookingApi } from '../services/api/bookings';
import BookingModal from '../components/modals/BookingModal';
import './HomePage.scss';

interface DateDay {
  date: number;
  day: string;
  fullDate: Date;
  isSelected: boolean;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDates, setCalendarDates] = useState<DateDay[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'all'>('individual');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState<string | null>(null);

  useEffect(() => {
    generateCalendarDates(new Date());
    loadCategories();
  }, []);

  useEffect(() => {
    loadClasses();
  }, [selectedDate, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await classApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const categoryId = selectedCategory === 'all' ? undefined : selectedCategory;
      
      const data = await classApi.getSchedulesByDate(dateStr, categoryId);
      setClasses(data);
    } catch (err) {
      console.error('Failed to load classes:', err);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDates = (currentDate: Date) => {
    const dates: DateDay[] = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2),
        fullDate: date,
        isSelected: date.toDateString() === currentDate.toDateString(),
      });
    }
    
    setCalendarDates(dates);
  };

  const handleDateSelect = (dateDay: DateDay) => {
    setSelectedDate(dateDay.fullDate);
    setCalendarDates(prev => 
      prev.map(d => ({
        ...d,
        isSelected: d.fullDate.toDateString() === dateDay.fullDate.toDateString(),
      }))
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 18) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const handleBookClass = (classSchedule: ClassSchedule) => {
    if (!user) {
      // Navigate to login - for now just alert
      alert(t('auth.pleaseLogin'));
      return;
    }

    if (classSchedule.is_waitlist) {
      // Handle waitlist
      handleWaitlist(classSchedule);
    } else {
      // Open booking modal
      setSelectedClass(classSchedule);
      setIsBookingModalOpen(true);
    }
  };

  const handleWaitlist = async (classSchedule: ClassSchedule) => {
    if (!user) return;

    try {
      setWaitlistLoading(classSchedule.id);
      
      const waitlistData = {
        class_id: parseInt(classSchedule.class_id),
        class_schedule_id: parseInt(classSchedule.id),
        startDate: classSchedule.date,
      };

      // Check if already in waitlist (you may want to track this in state)
      const isInWaitlist = false; // TODO: Track waitlist state

      if (isInWaitlist) {
        await bookingApi.removeFromWaitlist(waitlistData);
        alert(t('waitlist.removed'));
      } else {
        await bookingApi.addToWaitlist(waitlistData);
        alert(t('waitlist.added'));
      }

      // Refresh classes to update waitlist status
      await loadClasses();
    } catch (err: any) {
      console.error('Waitlist action failed:', err);
      alert(err.response?.data?.message || t('waitlist.failed'));
    } finally {
      setWaitlistLoading(null);
    }
  };

  const handleBookingSuccess = () => {
    alert(t('booking.success'));
    loadClasses(); // Refresh to update spots remaining
  };

  const formatTime = (time: string) => {
    // Convert 24h format to 12h format if needed
    return time; // Backend should already provide formatted time
  };

  if (loading && classes.length === 0) {
    return (
      <div className="home-page">
        <div className="home-header">
          <div className="home-header__left">
            <img 
              src="/icons/common/profilePlaceholder.png" 
              alt="Profile"
              className="home-header__avatar"
            />
          </div>
          <div className="home-header__center">
            <p className="home-header__greeting">{getGreeting()}, {user?.firstName || 'Guest'}</p>
          </div>
          <div className="home-header__right">
            <button className="home-header__notification">
              <img src="/icons/home/bell.png" alt="Notifications" />
            </button>
          </div>
        </div>
        <div className="classes-list">
          <p className="classes-list__loading">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-header__left">
          <img 
            src="/icons/common/profilePlaceholder.png" 
            alt="Profile"
            className="home-header__avatar"
          />
        </div>
        <div className="home-header__center">
          <p className="home-header__greeting">{getGreeting()}, {user?.firstName || 'Guest'}</p>
        </div>
        <div className="home-header__right">
          <button className="home-header__notification">
            <img src="/icons/home/bell.png" alt="Notifications" />
          </button>
        </div>
      </div>

      {/* Date Section */}
      <div className="date-section">
        <p className="date-section__date">
          {selectedDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric' 
          })}
        </p>
        <h2 className="date-section__day">
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </h2>
      </div>

      {/* Calendar */}
      <div className="calendar-section">
        <div className="calendar-dates">
          {calendarDates.map((dateDay, index) => (
            <button
              key={index}
              className={`calendar-date ${dateDay.isSelected ? 'calendar-date--selected' : ''}`}
              onClick={() => handleDateSelect(dateDay)}
            >
              <span className="calendar-date__number">{dateDay.date}</span>
              <span className="calendar-date__day">{dateDay.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <div className="filter-dropdown">
          <img src="/icons/common/calendar.png" alt="" className="filter-dropdown__icon" />
          <span className="filter-dropdown__label">{t('home.pilatesType')}</span>
          <select 
            className="filter-dropdown__select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">{t('home.all')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="booking-tabs">
        <button
          className={`booking-tab ${activeTab === 'individual' ? 'booking-tab--active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          {t('home.bookIndividual')}
        </button>
        <button
          className={`booking-tab ${activeTab === 'all' ? 'booking-tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('home.bookAll')}
        </button>
      </div>

      {/* Classes List */}
      <div className="classes-list">
        {error ? (
          <p className="classes-list__error">{error}</p>
        ) : classes.length === 0 ? (
          <p className="classes-list__empty">{t('home.noClasses')}</p>
        ) : (
          classes.map(classItem => (
            <div key={classItem.id} className="class-card">
              <div className="class-card__header">
                <span className="class-card__time">{formatTime(classItem.time)}</span>
                <span className="class-card__duration">{classItem.duration}m</span>
              </div>
              
              <div className="class-card__body">
                <div className="class-card__info">
                  <h3 className="class-card__name">{classItem.class_name}</h3>
                  <span className={`class-card__type class-card__type--${classItem.type}`}>
                    {classItem.type === 'group' ? t('home.group') : t('home.private')}
                  </span>
                </div>

                <div className="class-card__details">
                  <div className="class-card__trainer">
                    <img src="/icons/common/singlePerson.png" alt="" />
                    <span>{classItem.instructor_name}</span>
                  </div>
                  <div className="class-card__capacity">
                    <img src="/icons/home/multiPeople.png" alt="" />
                    <span>
                      {classItem.spots_remaining > 0 
                        ? `${classItem.spots_remaining} ${t('home.spotsRemaining')}`
                        : t('home.noSpots')}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                className={`class-card__action ${classItem.is_waitlist ? 'class-card__action--waitlist' : ''}`}
                onClick={() => handleBookClass(classItem)}
                disabled={classItem.status !== 'active' || waitlistLoading === classItem.id}
              >
                {waitlistLoading === classItem.id ? (
                  <span className="class-card__spinner">⏳</span>
                ) : classItem.is_waitlist ? (
                  <img src="/icons/common/clock.png" alt="Waitlist" />
                ) : (
                  <img src="/icons/home/plus.png" alt="Book" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        classSchedule={selectedClass}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedClass(null);
        }}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default HomePage;
