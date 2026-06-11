/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  ServiceItem,
  ProductItem,
  TestimonialItem,
  FAQItem,
  BrandItem,
  SupportStep,
  EstimatorDevice,
  FeatureItem,
  TeamMember,
  GalleryItem,
  AdminEstimatorDevice,
  AdminEstimatorIssue,
} from '../types.ts';
import type { BusinessInfo } from './data-store.ts';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const API_ORIGIN = BASE.replace(/\/api$/, '');

function resolveUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

// ─── Token ───────────────────────────────────────────────

const TOKEN_KEY = 'gta_api_token';
const REFRESH_TOKEN_KEY = 'gta_api_refresh_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function storeRefreshToken(token: string | undefined): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── Auth ────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; username: string; role: string; display_name: string | null };
}

function mapLoginResponse(data: Record<string, unknown>): LoginResponse {
  const user = data.user as Record<string, unknown> | undefined;
  return {
    accessToken: data.accessToken as string,
    refreshToken: data.refreshToken as string,
    expiresIn: (data.expiresIn as number) || 3600,
    user: {
      id: String(user?.id ?? ''),
      username: (user?.username as string) || '',
      role: (user?.role as string) || 'admin',
      display_name: (user?.display_name as string) || null,
    },
  };
}

export async function loginAPI(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    const msg = (err as { error?: string }).error || (err as { message?: string }).message || 'Credenciais inválidas';
    throw new Error(msg);
  }
  const data = await res.json() as Record<string, unknown>;
  return mapLoginResponse(data);
}

export async function refreshTokenAPI(): Promise<LoginResponse> {
  const token = getStoredToken();
  if (!token) throw new Error('Sessão expirada');

  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    clearToken();
    throw new Error('Sessão expirada');
  }
  const data = (await res.json()) as LoginResponse;
  storeToken(data.accessToken);
  return data;
}

export async function logoutAPI(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  clearToken();
  if (refreshToken) {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
}

// ─── Public Helpers ──────────────────────────────────────

// ─── Pagination ──────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

async function adminPaginatedGet<T>(path: string, page: number, mapper?: (item: Record<string, unknown>) => T): Promise<PaginatedResponse<T>> {
  const res = await authFetch(`${path}?page=${page}`);
  const json = await res.json() as {
    data: Record<string, unknown>[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  return {
    data: mapper ? json.data.map(mapper) : json.data as unknown as T[],
    current_page: json.current_page,
    last_page: json.last_page,
    per_page: json.per_page,
    total: json.total,
    from: json.from,
    to: json.to,
  };
}

// ─── Helpers ─────────────────────────────────────────────

async function pubGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/public${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  if (!token) throw new Error('Sessão expirada');

  const res = await fetch(`${BASE}/admin${path}`, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` } as Record<string, string>,
  });

  if (res.status === 401) {
    clearToken();
    throw new Error('Sessão expirada');
  }

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json() as Record<string, unknown>;
      if (body.errors && typeof body.errors === 'object') {
        const errs = body.errors as Record<string, string[]>;
        const msgs = Object.values(errs).flat().filter(Boolean);
        if (msgs.length > 0) message = msgs.join('; ');
      } else if (body.message) {
        message = body.message as string;
      } else if (body.error) {
        message = body.error as string;
      }
    } catch { /* ignore parse errors */ }
    throw new Error(message);
  }

  return res;
}

async function adminGet<T>(path: string): Promise<T> {
  const res = await authFetch(path);
  return res.json() as Promise<T>;
}

async function adminPost<T>(path: string, body: unknown): Promise<T> {
  const res = await authFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}

async function adminPut<T>(path: string, body: unknown): Promise<T> {
  const res = await authFetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}

async function adminDelete(path: string): Promise<void> {
  await authFetch(path, { method: 'DELETE' });
}

// ─── Schema Mappers ──────────────────────────────────────

function mapServiceFromAPI(a: Record<string, unknown>): ServiceItem {
  return {
    id: a.id as string,
    title: a.title as string,
    iconName: (a.icon as string) || 'Smartphone',
    description: (a.description as string) || '',
    features: typeof a.features === 'string' ? JSON.parse(a.features as string) : (a.features as string[]) || [],
    priceRange: (a.priceRange as string) || '',
    avgTime: (a.avgTime as string) || '',
  };
}

function mapServiceToAPI(item: ServiceItem): Record<string, unknown> {
  return {
    title: item.title,
    icon: item.iconName,
    description: item.description,
    features: JSON.stringify(item.features),
    priceRange: item.priceRange,
    avgTime: item.avgTime,
  };
}

function mapProductFromAPI(a: Record<string, unknown>): ProductItem {
  return {
    id: a.id as string,
    name: a.name as string,
    category: (a.category as ProductItem['category']) || 'smartphones',
    price: (a.price as number) || 0,
    originalPrice: a.originalPrice as number | undefined,
    iconName: (a.icon as string) || 'Smartphone',
    imageUrl: resolveUrl((a.image as string) || ''),
    description: (a.description as string) || '',
    specs: typeof a.specs === 'string' ? JSON.parse(a.specs as string) : (a.specs as string[]) || [],
    inStock: (a.in_stock as boolean) ?? true,
    condition: (a.condition as string) || 'Recondicionado Grade A+',
  };
}

function mapProductToAPI(item: ProductItem): Record<string, unknown> {
  return {
    name: item.name,
    category: item.category,
    price: item.price,
    original_price: item.originalPrice || null,
    icon: item.iconName,
    image: item.imageUrl,
    description: item.description,
    specs: item.specs || [],
    in_stock: item.inStock,
    condition: item.condition,
  };
}

function mapTestimonialFromAPI(a: Record<string, unknown>): TestimonialItem {
  return {
    id: a.id as string,
    name: a.name as string,
    deviceRepaired: (a.role as string) || '',
    comment: (a.text as string) || '',
    rating: (a.rating as number) || 5,
    date: '',
  };
}

function mapTestimonialToAPI(item: TestimonialItem): Record<string, unknown> {
  return {
    name: item.name,
    role: item.deviceRepaired,
    text: item.comment,
    rating: item.rating,
  };
}

function mapFAQFromAPI(a: Record<string, unknown>): FAQItem {
  return {
    id: a.id as string,
    question: a.question as string,
    answer: (a.answer as string) || '',
  };
}

function mapFAQToAPI(item: FAQItem): Record<string, unknown> {
  return { question: item.question, answer: item.answer, sortOrder: 0 };
}

function mapBrandFromAPI(a: Record<string, unknown>): BrandItem {
  return {
    id: a.id as string,
    name: a.name as string,
    logoType: (a.logo as string) || 'smartphone',
  };
}

function mapBrandToAPI(item: BrandItem): Record<string, unknown> {
  return { name: item.name, logo: item.logoType };
}

function mapProcessFromAPI(a: Record<string, unknown>): SupportStep & { _apiId: string } {
  return {
    step: (a.step as number) || 0,
    title: a.title as string,
    description: (a.description as string) || '',
    badge: (a.icon as string) || '',
    _apiId: (a.id as string) || '',
  } as SupportStep & { _apiId: string };
}

function mapProcessToAPI(item: SupportStep): Record<string, unknown> {
  return { step: item.step, title: item.title, description: item.description, icon: item.badge };
}

function mapFeatureFromAPI(a: Record<string, unknown>): FeatureItem {
  return {
    id: a.id as string,
    title: a.title as string,
    description: (a.description as string) || '',
    badge: (a.badge as string) || '',
    icon: (a.icon as string) || '',
  };
}

function mapTeamFromAPI(a: Record<string, unknown>): TeamMember {
  return {
    id: a.id as string,
    name: a.name as string,
    role: (a.role as string) || '',
    photoUrl: resolveUrl((a.photo as string) || ''),
    bio: (a.bio as string) || '',
    socialLinks: (a.social_links as TeamMember['socialLinks']) || {},
  };
}

function mapTeamToAPI(item: TeamMember): Record<string, unknown> {
  return {
    name: item.name,
    role: item.role,
    photo: item.photoUrl,
    bio: item.bio,
    socialLinks: item.socialLinks,
  };
}

function mapGalleryFromAPI(a: Record<string, unknown>): GalleryItem {
  return {
    id: a.id as string,
    title: (a.title as string) || '',
    category: (a.category as GalleryItem['category']) || 'oficina',
    imageUrl: resolveUrl((a.image as string) || ''),
    description: (a.description as string) || '',
  };
}

function mapGalleryToAPI(item: GalleryItem): Record<string, unknown> {
  return {
    title: item.title,
    category: item.category,
    image: item.imageUrl,
    description: item.description,
  };
}

function mapInfoFromAPI(a: Record<string, unknown>): BusinessInfo {
  return {
    name: (a.companyName as string) || 'GTA Tech',
    slogan: (a.slogan as string) || '',
    description: (a.about as string) || '',
    phone: (a.phone as string) || '',
    whatsapp: (a.whatsapp as string) || '',
    email: (a.email as string) || '',
    address: (a.address as string) || '',
    hours: (a.workingHours as string) || '',
    city: (a.city as string) || '',
    logoUrl: resolveUrl((a.logo as string) || ''),
    faviconUrl: resolveUrl((a.favicon as string) || ''),
  };
}

function mapInfoToAPI(info: BusinessInfo): Record<string, unknown> {
  return {
    companyName: info.name,
    about: info.description,
    phone: info.phone,
    whatsapp: info.whatsapp,
    email: info.email,
    address: info.address,
    workingHours: info.hours,
    slogan: info.slogan,
    city: info.city,
    logo: info.logoUrl,
    favicon: info.faviconUrl,
  };
}

// ─── Public (no auth) ────────────────────────────────────

export async function submitContact(data: { name: string; email: string; phone: string; message: string }): Promise<void> {
  const res = await fetch(`${BASE}/public/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Erro ao enviar mensagem');
  }
}

// ─── Landing (único endpoint público) ─────────────────────

export interface LandingData {
  businessInfo: BusinessInfo;
  services: ServiceItem[];
  products: ProductItem[];
  testimonials: TestimonialItem[];
  faqs: FAQItem[];
  brands: BrandItem[];
  process: SupportStep[];
  estimator: EstimatorDevice[];
  features: FeatureItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  settings: Record<string, string>;
}

export async function fetchLanding(): Promise<LandingData> {
  const raw = await pubGet<Record<string, unknown>>('/landing');
  return {
    businessInfo: mapInfoFromAPI((raw.info as Record<string, unknown>) || {}),
    services: ((raw.services as Record<string, unknown>[]) || []).map(mapServiceFromAPI),
    products: ((raw.products as Record<string, unknown>[]) || []).map(mapProductFromAPI),
    testimonials: ((raw.testimonials as Record<string, unknown>[]) || []).map(mapTestimonialFromAPI),
    faqs: ((raw.faqs as Record<string, unknown>[]) || []).map(mapFAQFromAPI),
    brands: ((raw.brands as Record<string, unknown>[]) || []).map(mapBrandFromAPI),
    process: ((raw.process as Record<string, unknown>[]) || []).map(mapProcessFromAPI),
    estimator: ((raw.estimator as Record<string, unknown>[]) || []).map((dev) => ({
      id: dev.id as string,
      label: (dev.name as string) || '',
      brands: (dev.brands as string[]) || [],
      issues: ((dev.issues as Record<string, unknown>[]) || []).map((iss) => ({
        id: iss.id as string,
        label: (iss.name as string) || '',
        basePrice: Number(iss.local_price) || 0,
        estimatedTime: (iss.estimated_time as string) || '',
      })),
    })),
    features: ((raw.features as Record<string, unknown>[]) || []).map(mapFeatureFromAPI),
    team: ((raw.team as Record<string, unknown>[]) || []).map(mapTeamFromAPI),
    gallery: ((raw.gallery as Record<string, unknown>[]) || []).map(mapGalleryFromAPI),
    settings: (raw.settings as Record<string, string>) || {},
  };
}

// ─── Admin API (autenticado) ─────────────────────────────

export async function adminFetchServices(page = 1): Promise<PaginatedResponse<ServiceItem>> {
  return adminPaginatedGet('/services', page, mapServiceFromAPI);
}

export async function adminCreateService(item: ServiceItem): Promise<ServiceItem> {
  const created = await adminPost<Record<string, unknown>>('/services', mapServiceToAPI(item));
  return mapServiceFromAPI(created);
}

export async function adminUpdateService(id: string, item: ServiceItem): Promise<ServiceItem> {
  const updated = await adminPut<Record<string, unknown>>(`/services/${id}`, mapServiceToAPI(item));
  return mapServiceFromAPI(updated);
}

export async function adminDeleteService(id: string): Promise<void> {
  await adminDelete(`/services/${id}`);
}

export async function adminFetchProducts(page = 1): Promise<PaginatedResponse<ProductItem>> {
  return adminPaginatedGet('/products', page, mapProductFromAPI);
}

export async function adminCreateProduct(item: ProductItem): Promise<ProductItem> {
  const created = await adminPost<Record<string, unknown>>('/products', mapProductToAPI(item));
  return mapProductFromAPI(created);
}

export async function adminUpdateProduct(id: string, item: ProductItem): Promise<ProductItem> {
  const updated = await adminPut<Record<string, unknown>>(`/products/${id}`, mapProductToAPI(item));
  return mapProductFromAPI(updated);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await adminDelete(`/products/${id}`);
}

export async function adminFetchTestimonials(page = 1): Promise<PaginatedResponse<TestimonialItem>> {
  return adminPaginatedGet('/testimonials', page, mapTestimonialFromAPI);
}

export async function adminCreateTestimonial(item: TestimonialItem): Promise<TestimonialItem> {
  const created = await adminPost<Record<string, unknown>>('/testimonials', mapTestimonialToAPI(item));
  return mapTestimonialFromAPI(created);
}

export async function adminUpdateTestimonial(id: string, item: TestimonialItem): Promise<TestimonialItem> {
  const updated = await adminPut<Record<string, unknown>>(`/testimonials/${id}`, mapTestimonialToAPI(item));
  return mapTestimonialFromAPI(updated);
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  await adminDelete(`/testimonials/${id}`);
}

export async function adminFetchFAQs(page = 1): Promise<PaginatedResponse<FAQItem>> {
  return adminPaginatedGet('/faqs', page, mapFAQFromAPI);
}

export async function adminCreateFAQ(item: FAQItem): Promise<FAQItem> {
  const created = await adminPost<Record<string, unknown>>('/faqs', mapFAQToAPI(item));
  return mapFAQFromAPI(created);
}

export async function adminUpdateFAQ(id: string, item: FAQItem): Promise<FAQItem> {
  const updated = await adminPut<Record<string, unknown>>(`/faqs/${id}`, mapFAQToAPI(item));
  return mapFAQFromAPI(updated);
}

export async function adminDeleteFAQ(id: string): Promise<void> {
  await adminDelete(`/faqs/${id}`);
}

export async function adminFetchBrands(page = 1): Promise<PaginatedResponse<BrandItem>> {
  return adminPaginatedGet('/brands', page, mapBrandFromAPI);
}

export async function adminCreateBrand(item: BrandItem): Promise<BrandItem> {
  const created = await adminPost<Record<string, unknown>>('/brands', mapBrandToAPI(item));
  return mapBrandFromAPI(created);
}

export async function adminUpdateBrand(id: string, item: BrandItem): Promise<BrandItem> {
  const updated = await adminPut<Record<string, unknown>>(`/brands/${id}`, mapBrandToAPI(item));
  return mapBrandFromAPI(updated);
}

export async function adminDeleteBrand(id: string): Promise<void> {
  await adminDelete(`/brands/${id}`);
}

export async function adminFetchProcess(page = 1): Promise<PaginatedResponse<SupportStep>> {
  return adminPaginatedGet('/process', page, mapProcessFromAPI);
}

export async function adminCreateProcess(item: SupportStep): Promise<SupportStep> {
  const created = await adminPost<Record<string, unknown>>('/process', mapProcessToAPI(item));
  return mapProcessFromAPI(created);
}

export async function adminUpdateProcess(id: string, item: SupportStep): Promise<SupportStep> {
  const updated = await adminPut<Record<string, unknown>>(`/process/${id}`, mapProcessToAPI(item));
  return mapProcessFromAPI(updated);
}

export async function adminDeleteProcess(id: string): Promise<void> {
  await adminDelete(`/process/${id}`);
}

export async function adminFetchInfo(): Promise<BusinessInfo> {
  const data = await adminGet<Record<string, unknown>>('/info');
  return mapInfoFromAPI(data);
}

export async function adminUpdateInfo(info: BusinessInfo): Promise<BusinessInfo> {
  const updated = await adminPut<Record<string, unknown>>('/info', mapInfoToAPI(info));
  return mapInfoFromAPI(updated);
}

// ─── Admin Team ───────────────────────────────────────────

export async function adminFetchTeam(page = 1): Promise<PaginatedResponse<TeamMember>> {
  return adminPaginatedGet('/team', page, mapTeamFromAPI);
}

export async function adminCreateTeam(item: TeamMember): Promise<TeamMember> {
  const created = await adminPost<Record<string, unknown>>('/team', mapTeamToAPI(item));
  return mapTeamFromAPI(created);
}

export async function adminUpdateTeam(id: string, item: TeamMember): Promise<TeamMember> {
  const updated = await adminPut<Record<string, unknown>>(`/team/${id}`, mapTeamToAPI(item));
  return mapTeamFromAPI(updated);
}

export async function adminDeleteTeam(id: string): Promise<void> {
  await adminDelete(`/team/${id}`);
}

// ─── Admin Gallery ────────────────────────────────────────

export async function adminFetchGallery(page = 1): Promise<PaginatedResponse<GalleryItem>> {
  return adminPaginatedGet('/gallery', page, mapGalleryFromAPI);
}

export async function adminCreateGallery(item: GalleryItem): Promise<GalleryItem> {
  const created = await adminPost<Record<string, unknown>>('/gallery', mapGalleryToAPI(item));
  return mapGalleryFromAPI(created);
}

export async function adminUpdateGallery(id: string, item: GalleryItem): Promise<GalleryItem> {
  const updated = await adminPut<Record<string, unknown>>(`/gallery/${id}`, mapGalleryToAPI(item));
  return mapGalleryFromAPI(updated);
}

export async function adminDeleteGallery(id: string): Promise<void> {
  await adminDelete(`/gallery/${id}`);
}

// ─── Admin Estimator ────────────────────────────────────────

export async function adminFetchEstimatorDevices(page = 1): Promise<PaginatedResponse<AdminEstimatorDevice>> {
  return adminPaginatedGet<AdminEstimatorDevice>('/estimator/devices', page);
}

export async function adminCreateEstimatorDevice(data: Partial<AdminEstimatorDevice>): Promise<AdminEstimatorDevice> {
  return adminPost<AdminEstimatorDevice>('/estimator/devices', data);
}

export async function adminUpdateEstimatorDevice(id: string, data: Partial<AdminEstimatorDevice>): Promise<AdminEstimatorDevice> {
  return adminPut<AdminEstimatorDevice>(`/estimator/devices/${id}`, data);
}

export async function adminDeleteEstimatorDevice(id: string): Promise<void> {
  await adminDelete(`/estimator/devices/${id}`);
}

export async function adminFetchEstimatorIssues(page = 1, deviceId?: string): Promise<PaginatedResponse<AdminEstimatorIssue>> {
  const query = deviceId ? `?device_id=${deviceId}&page=${page}` : `?page=${page}`;
  const res = await authFetch(`/estimator/issues${query}`);
  const json = await res.json() as {
    data: AdminEstimatorIssue[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  return json;
}

export async function adminCreateEstimatorIssue(data: Partial<AdminEstimatorIssue>): Promise<AdminEstimatorIssue> {
  return adminPost<AdminEstimatorIssue>('/estimator/issues', data);
}

export async function adminUpdateEstimatorIssue(id: string, data: Partial<AdminEstimatorIssue>): Promise<AdminEstimatorIssue> {
  return adminPut<AdminEstimatorIssue>(`/estimator/issues/${id}`, data);
}

export async function adminDeleteEstimatorIssue(id: string): Promise<void> {
  await adminDelete(`/estimator/issues/${id}`);
}

// ─── Admin Settings ───────────────────────────────────────

export async function adminFetchSettings(): Promise<Record<string, string>> {
  return adminGet<Record<string, string>>('/settings');
}

export async function adminUpdateSettings(settings: Record<string, string>): Promise<Record<string, string>> {
  return adminPut<Record<string, string>>('/settings', settings);
}

// ─── Upload ─────────────────────────────────────────────

export async function adminUploadImage(file: File): Promise<string> {
  const token = getStoredToken();
  if (!token) throw new Error('No auth token');

  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BASE}/admin/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { message?: string }).message || (err as { error?: string }).error || 'Erro ao enviar imagem. Verifique o formato (JPEG, PNG, WebP, GIF) e o tamanho (máx. 5MB).';
    throw new Error(msg);
  }

  const data = (await res.json()) as { url: string };
  return resolveUrl(data.url);
}

// ─── Admin Contacts ──────────────────────────────────────

export interface AdminContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export async function adminFetchContacts(page = 1): Promise<PaginatedResponse<AdminContact>> {
  return adminPaginatedGet<AdminContact>('/contacts', page);
}

export async function adminDeleteContact(id: string): Promise<void> {
  await adminDelete(`/contacts/${id}`);
}

// ─── Admin Users ─────────────────────────────────────────

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  display_name: string | null;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export async function adminFetchUsers(page = 1): Promise<PaginatedResponse<AdminUser>> {
  return adminPaginatedGet<AdminUser>('/users', page);
}

export async function adminFetchUserMe(): Promise<AdminUser> {
  return adminGet<AdminUser>('/users/me');
}

export async function adminChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  await adminPut('/users/me/password', { currentPassword, newPassword });
}

export async function adminCreateUser(data: { username: string; password: string; role?: string; display_name?: string }): Promise<AdminUser> {
  return adminPost<AdminUser>('/users', data);
}

export async function adminUpdateUser(id: string, data: { username?: string; role?: string; display_name?: string; active?: boolean; password?: string }): Promise<AdminUser> {
  return adminPut<AdminUser>(`/users/${id}`, data);
}

export async function adminDeleteUser(id: string): Promise<void> {
  await adminDelete(`/users/${id}`);
}
