import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { classApi, type ClassSchedule, type Category } from '../../services/api/classes';
import { bookingApi } from '../../services/api/bookings';
import './ClassesPage.scss';

interface DateDay {
  date: number;
  day: string;
  fullDate: Date;
  isSelected: boolean;
}

const ClassesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarDates, setCalendarDates] = useState<DateDay[]>([]);
  const [activeTab, setActiveTab] = useState<'individual' | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitlistLoading, setWaitlistLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    generateCalendarDates(new Date());
    loadCategories();
  }, []);

  useEffect(() => {
    loadClasses();
  }, [selectedDate, selectedCategory, activeTab, dateRange]);

  const generateCalendarDates = (startDate: Date) => {
    const dates: DateDay[] = [];
    const daysToShow = dateRange === 'day' ? 7 : dateRange === 'week' ? 14 : 30;

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        isSelected: i === 0,
      });
    }

    setCalendarDates(dates);
  };

  const loadCategories = async () => {
    try {
      const categories = await classApi.getCategories();
      setCategories(categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const formattedDate = selectedDate.toISOString().split('T')[0];
      const categoryId = selectedCategory !== 'all' ? selectedCategory : undefined;
      const schedules = await classApi.getSchedulesByDate(formattedDate, categoryId);

      let filteredClasses = schedules;

      // Filter by tab (individual vs all)
      if (activeTab === 'individual') {
        filteredClasses = filteredClasses.filter(
          (cls: ClassSchedule) => cls.type === 'private'
        );
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredClasses = filteredClasses.filter(
          (cls: ClassSchedule) =>
            cls.class_name?.toLowerCase().includes(query) ||
            cls.category_name?.toLowerCase().includes(query) ||
            cls.instructor_name?.toLowerCase().includes(query)
        );
      }

      setClasses(filteredClasses);
    } catch (err: any) {
      console.error('Failed to load classes:', err);
      setError(err.response?.data?.message || t('classes.loadFailed'));
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (day: DateDay) => {
    setSelectedDate(day.fullDate);
    setCalendarDates((prev) =>
      prev.map((d) => ({
        ...d,
        isSelected: d.fullDate.toDateString() === day.fullDate.toDateString(),
      }))
    );
  };

  const handleBookClass = (classSchedule: ClassSchedule) => {
    if (!user) {
      alert(t('booking.loginRequired'));
      navigate('/login');
      return;
    }

    navigate('/booking', { state: { classSchedule } });
  };

  const handleWaitlist = async (classSchedule: ClassSchedule) => {
    if (!user) {
      alert(t('waitlist.loginRequired'));
      navigate('/login');
      return;
    }

    try {
      setWaitlistLoading(classSchedule.id);

      const waitlistData = {
        class_id: parseInt(classSchedule.class_id),
        class_schedule_id: parseInt(classSchedule.id),
        startDate: classSchedule.date,
      };

      const isInWaitlist = false; // TODO: Track waitlist state

      if (isInWaitlist) {
        await bookingApi.removeFromWaitlist(waitlistData);
        alert(t('waitlist.removed'));
      } else {
        await bookingApi.addToWaitlist(waitlistData);
        alert(t('waitlist.added'));
      }

      await loadClasses();
    } catch (err: any) {
      console.error('Waitlist action failed:', err);
      alert(err.response?.data?.message || t('waitlist.failed'));
    } finally {
      setWaitlistLoading(null);
    }
  };

  const handleClassDetail = (classSchedule: ClassSchedule) => {
    navigate(`/classes/${classSchedule.id}`);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const renderClassCard = (classSchedule: ClassSchedule) => {
    const spotsRemaining = classSchedule.spots_remaining;
    const isFull = spotsRemaining <= 0;

    return (
      <div
        key={classSchedule.id}
        className="class-card"
        onClick={() => handleClassDetail(classSchedule)}
      >
        <div className="class-card__header">
          <div className="class-card__category">
            {classSchedule.category_name || t('classes.uncategorized')}
          </div>
          <div className="class-card__time">{formatTime(classSchedule.time)}</div>
        </div>

        <h3 className="class-card__name">{classSchedule.class_name}</h3>

        {classSchedule.instructor_name && (
          <div className="class-card__instructor">
            <span className="class-card__instructor-icon">👤</span>
            {classSchedule.instructor_name}
          </div>
        )}

        <div className="class-card__footer">
          <div className="class-card__spots">
            <span className={`class-card__spots-count ${isFull ? 'full' : ''}`}>
              {spotsRemaining} {t('classes.spotsLeft')}
            </span>
          </div>

          <div className="class-card__actions" onClick={(e) => e.stopPropagation()}>
            {isFull ? (
              <button
                className="class-card__button class-card__button--waitlist"
                onClick={() => handleWaitlist(classSchedule)}
                disabled={waitlistLoading === classSchedule.id}
              >
                {waitlistLoading === classSchedule.id ? '...' : t('classes.joinWaitlist')}
              </button>
            ) : (
              <button
                className="class-card__button class-card__button--book"
                onClick={() => handleBookClass(classSchedule)}
              >
                {t('classes.book')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && classes.length === 0) {
    return (
      <div className="classes-page">
        <div className="classes-page__loading">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="classes-page">
      <div className="classes-header">
        <h1 className="classes-header__title">{t('classes.title')}</h1>
        
        {/* Search Bar */}
        <div className="classes-search">
          <input
            type="text"
            className="classes-search__input"
            placeholder={t('classes.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="classes-search__clear"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>

        {/* Date Range Toggle */}
        <div className="classes-range">
          <button
            className={`classes-range__button ${dateRange === 'day' ? 'active' : ''}`}
            onClick={() => {
              setDateRange('day');
              generateCalendarDates(selectedDate);
            }}
          >
            {t('classes.day')}
          </button>
          <button
            className={`classes-range__button ${dateRange === 'week' ? 'active' : ''}`}
            onClick={() => {
              setDateRange('week');
              generateCalendarDates(selectedDate);
            }}
          >
            {t('classes.week')}
          </button>
          <button
            className={`classes-range__button ${dateRange === 'month' ? 'active' : ''}`}
            onClick={() => {
              setDateRange('month');
              generateCalendarDates(selectedDate);
            }}
          >
            {t('classes.month')}
          </button>
        </div>

        {/* Calendar */}
        <div className="classes-calendar">
          {calendarDates.map((day, index) => (
            <div
              key={index}
              className={`classes-calendar__day ${day.isSelected ? 'selected' : ''}`}
              onClick={() => handleDateSelect(day)}
            >
              <div className="classes-calendar__day-name">{day.day}</div>
              <div className="classes-calendar__day-number">{day.date}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="classes-tabs">
          <button
            className={`classes-tabs__tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t('classes.allClasses')}
          </button>
          <button
            className={`classes-tabs__tab ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => setActiveTab('individual')}
          >
            {t('classes.individual')}
          </button>
        </div>

        {/* Category Filter */}
        <div className="classes-categories">
          <button
            className={`classes-categories__button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            {t('classes.allCategories')}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`classes-categories__button ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="classes-content">
        {error && <div className="classes-content__error">{error}</div>}

        {!loading && classes.length === 0 && !error && (
          <div className="classes-content__empty">
            <p>{t('classes.noClasses')}</p>
          </div>
        )}

        <div className="classes-grid">
          {classes.map((classSchedule) => renderClassCard(classSchedule))}
        </div>

        {loading && classes.length > 0 && (
          <div className="classes-content__loading">{t('common.loading')}</div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
