export interface User {
    id: number;
    name: string;
    email: string;
    is_pharmacy: boolean;
    location?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    created_at: string;
}

export interface Medicine {
    id: number;
    name: string;
    manufacturer?: string;
    description?: string;
}

export interface Inventory {
    id: number;
    pharmacy_id: number;
    medicine_id: number;
    name: string;
    manufacturer?: string;
    description?: string;
    stock: number;
    price: number;
    expiry_date: string;
}

export interface Pharmacy {
    id: number;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    distance_km?: number;
}

export interface FoundMedicine {
    medicine_name: string;
    stock: number;
    price: number;
    expiry_date: string;
}

export interface PharmacyDetails {
    pharmacy_name: string;
    pharmacy_address: string;
    distance_km: number;
}

export interface SearchResult {
    details: PharmacyDetails;
    medicines: FoundMedicine[];
}

export interface AuthResponse {
    token: string;
    user?: User;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    is_pharmacy: boolean;
    address_line: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface SearchData {
    address: string;
    medicine_name: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}