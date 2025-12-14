import { api } from './client';
import type { Package, UserPackage } from '@store';

export const packageApi = {
  // Get all available packages
  getPackages: () =>
    api.get<Package[]>('/packages'),
  
  // Get package by ID
  getPackageById: (packageId: string) =>
    api.get<Package>(`/packages/${packageId}`),
  
  // Get user's purchased packages
  getUserPackages: () =>
    api.get<UserPackage[]>('/packages/user'),
  
  // Get active user packages
  getActiveUserPackages: () =>
    api.get<UserPackage[]>('/packages/user/active'),
  
  // Get user package by ID
  getUserPackageById: (id: string) =>
    api.get<UserPackage>(`/packages/user/${id}`),
  
  // Purchase a package (returns checkout/payment URL)
  purchasePackage: (packageId: string) =>
    api.post<{ checkoutUrl: string; transactionId: string }>('/packages/purchase', {
      packageId,
    }),
};
