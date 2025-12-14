import { create } from 'zustand';

export interface Package {
  id: string;
  name: string;
  description: string;
  type: 'single' | 'monthly' | 'quarterly' | 'annual';
  price: number;
  originalPrice?: number; // For showing discounts
  credits: number; // Number of classes included
  validityDays: number; // How many days the package is valid
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  categoryId?: string; // If package is category-specific
}

export interface UserPackage {
  id: string;
  packageId: string;
  packageName: string;
  purchaseDate: string;
  expiryDate: string;
  totalCredits: number;
  remainingCredits: number;
  usedCredits: number;
  status: 'active' | 'expired' | 'used';
  transactionId: string;
}

interface PackageState {
  packages: Package[];
  userPackages: UserPackage[];
  selectedPackage: Package | null;
  isLoading: boolean;
  
  // Actions
  setPackages: (packages: Package[]) => void;
  setUserPackages: (userPackages: UserPackage[]) => void;
  setSelectedPackage: (pkg: Package | null) => void;
  getPackageById: (packageId: string) => Package | undefined;
  getUserPackageById: (id: string) => UserPackage | undefined;
  getActiveUserPackages: () => UserPackage[];
  updateUserPackageCredits: (packageId: string, creditsUsed: number) => void;
  clearPackages: () => void;
}

export const usePackageStore = create<PackageState>((set, get) => ({
  packages: [],
  userPackages: [],
  selectedPackage: null,
  isLoading: false,

  setPackages: (packages) => {
    set({ packages });
  },

  setUserPackages: (userPackages) => {
    set({ userPackages });
  },

  setSelectedPackage: (pkg) => {
    set({ selectedPackage: pkg });
  },

  getPackageById: (packageId) => {
    const packages = get().packages;
    return packages.find(pkg => pkg.id === packageId);
  },

  getUserPackageById: (id) => {
    const userPackages = get().userPackages;
    return userPackages.find(pkg => pkg.id === id);
  },

  getActiveUserPackages: () => {
    const userPackages = get().userPackages;
    const now = new Date();
    return userPackages.filter(pkg => 
      pkg.status === 'active' && 
      pkg.remainingCredits > 0 && 
      new Date(pkg.expiryDate) > now
    );
  },

  updateUserPackageCredits: (packageId, creditsUsed) => {
    set(state => ({
      userPackages: state.userPackages.map(pkg =>
        pkg.id === packageId
          ? {
              ...pkg,
              remainingCredits: pkg.remainingCredits - creditsUsed,
              usedCredits: pkg.usedCredits + creditsUsed,
              status: pkg.remainingCredits - creditsUsed <= 0 ? 'used' : pkg.status,
            }
          : pkg
      ),
    }));
  },

  clearPackages: () => {
    set({ packages: [], selectedPackage: null });
  },
}));
