import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@services/api/client';
import ErrorBoundary from '@components/common/ErrorBoundary';
import './PackagesPage.scss';

interface PackageSession {
  id: number;
  package_session: string;
  package_session_ar: string;
  description: string;
  description_ar: string;
}

interface Package {
  id: number;
  package_name: string;
  package_name_ar: string | null;
  price: number;
  class_limit: number;
  package_type: number; // 0 = package, 1 = drop-in
  duration: number; // months
  session_id: number;
  package_session: PackageSession;
  description: string;
  description_ar: string | null;
  status: string;
}

interface PackageCategory {
  session: PackageSession;
  packages: Package[];
  isExpanded: boolean;
}

const PackagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [packageSessions, setPackageSessions] = useState<PackageSession[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | 'all'>('all');
  const [packageCategories, setPackageCategories] = useState<PackageCategory[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (packages.length > 0 && packageSessions.length > 0) {
      organizePackagesByCategory();
    }
  }, [packages, packageSessions, selectedSessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[PackagesPage] Loading package sessions and packages...');

      // Load package sessions and packages in parallel
      const [sessionsRes, packagesRes] = await Promise.all([
        api.get<{ status: boolean; packageSession: PackageSession[] }>('/v1/package/getPackageSession'),
        api.get<{ status: boolean; packages: Package[] }>('/v1/package/', { params: { type: 'active' } })
      ]);

      console.log('[PackagesPage] Sessions response:', sessionsRes);
      console.log('[PackagesPage] Packages response:', packagesRes);

      setPackageSessions(sessionsRes.packageSession || []);
      setPackages(packagesRes.packages || []);
    } catch (err: any) {
      console.error('[PackagesPage] Error loading packages:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      
      // Show more detailed error message
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || t('packages.loadFailed');
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const organizePackagesByCategory = () => {
    // Filter packages by selected session
    const filteredPackages = selectedSessionId === 'all'
      ? packages
      : packages.filter(pkg => pkg.session_id === selectedSessionId);

    // Group packages by session
    const grouped = packageSessions.reduce<PackageCategory[]>((acc, session) => {
      const sessionPackages = filteredPackages.filter(pkg => pkg.session_id === session.id);
      
      if (sessionPackages.length > 0) {
        acc.push({
          session,
          packages: sessionPackages,
          isExpanded: true // All expanded by default
        });
      }
      
      return acc;
    }, []);

    setPackageCategories(grouped);
  };

  const toggleCategory = (sessionId: number) => {
    setPackageCategories(prev =>
      prev.map(cat =>
        cat.session.id === sessionId
          ? { ...cat, isExpanded: !cat.isExpanded }
          : cat
      )
    );
  };

  const handlePackageClick = (pkg: Package) => {
    // Navigate to booking page with package selection
    navigate('/booking', { 
      state: { 
        preselectedPackageId: pkg.id,
        fromPackagesPage: true 
      } 
    });
  };

  const getSessionName = (session: PackageSession): string => {
    return isRTL ? session.package_session_ar : session.package_session;
  };

  const getPackageName = (pkg: Package): string => {
    return isRTL ? (pkg.package_name_ar || pkg.package_name) : pkg.package_name;
  };

  const formatPrice = (price: number): string => {
    if (typeof price !== 'number' || isNaN(price)) return `0 ${t('packages.currency')}`;
    return `${price.toFixed(0)} ${t('packages.currency')}`;
  };

  const getPackageDuration = (duration: number): string => {
    if (duration === 1) return t('packages.oneMonth');
    if (duration === 2) return `2 ${t('packages.months')}`;
    if (duration === 3) return `3 ${t('packages.months')}`;
    if (duration === 12) return t('packages.oneYear');
    return `${duration} ${t('packages.months')}`;
  };

  if (loading) {
    return (
      <div className="packages-page">
        <div className="packages-page__header">
          <h1 className="packages-page__title">{t('packages.title')}</h1>
        </div>
        <div className="packages-page__loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="packages-page">
        <div className="packages-page__header">
          <h1 className="packages-page__title">{t('packages.title')}</h1>
        </div>
        <div className="packages-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="packages-page" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="packages-page__header">
        <h1 className="packages-page__title">{t('packages.title')}</h1>
      </div>

      {/* Session Filter Tabs */}
      <div className="packages-page__tabs">
        <div className="session-tabs">
          <button
            className={`session-tabs__tab ${selectedSessionId === 'all' ? 'session-tabs__tab--active' : ''}`}
            onClick={() => setSelectedSessionId('all')}
          >
            {t('packages.allPackages')}
          </button>
          {packageSessions.map(session => (
            <button
              key={session.id}
              className={`session-tabs__tab ${selectedSessionId === session.id ? 'session-tabs__tab--active' : ''}`}
              onClick={() => setSelectedSessionId(session.id)}
            >
              {getSessionName(session)}
            </button>
          ))}
        </div>
      </div>

      {/* Package Categories */}
      <div className="packages-page__content">
        {packageCategories.length === 0 ? (
          <div className="packages-page__empty">
            <p>{t('packages.noPackages')}</p>
          </div>
        ) : (
          packageCategories.map(category => (
            <div key={category.session.id} className="package-category">
              {/* Category Header */}
              <button
                className="package-category__header"
                onClick={() => toggleCategory(category.session.id)}
              >
                <h2 className="package-category__title">
                  {getSessionName(category.session)}
                </h2>
                <span className={`package-category__arrow ${category.isExpanded ? 'package-category__arrow--up' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Package List */}
              {category.isExpanded && (
                <div className="package-category__packages">
                  {category.packages.map(pkg => (
                    <div
                      key={pkg.id}
                      className="package-card"
                      onClick={() => handlePackageClick(pkg)}
                    >
                      <div className="package-card__header">
                        <h3 className="package-card__name">{getPackageName(pkg)}</h3>
                        {pkg.package_type === 1 && (
                          <span className="package-card__badge package-card__badge--popular">
                            {t('packages.popular')}
                          </span>
                        )}
                      </div>

                      <div className="package-card__details">
                        <div className="package-card__detail">
                          <span className="package-card__label">{t('packages.classes')}</span>
                          <span className="package-card__value">{pkg.class_limit}</span>
                        </div>

                        <div className="package-card__detail">
                          <span className="package-card__label">{t('packages.validity')}</span>
                          <span className="package-card__value">{getPackageDuration(pkg.duration)}</span>
                        </div>

                        <div className="package-card__detail package-card__detail--price">
                          <span className="package-card__label">{t('packages.price')}</span>
                          <span className="package-card__price">{formatPrice(pkg.price)}</span>
                        </div>
                      </div>

                      <button className="package-card__button">
                        {t('packages.selectPackage')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Wrap with ErrorBoundary
const PackagesPageWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <PackagesPage />
  </ErrorBoundary>
);

export default PackagesPageWithErrorBoundary;
