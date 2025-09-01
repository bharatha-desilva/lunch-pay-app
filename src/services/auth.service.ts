import apiService from './api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types/auth.types';
import { authStorage } from '@/utils/storage';

/**
 * Authentication service for login, register, and session management
 */
class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // ReqRes API specific endpoint for login
      const response = await apiService.post<{ token: string }>(
        '/login',
        credentials
      );
      
      // Create a mock user object since ReqRes doesn't return user data
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      
      const authResponse: AuthResponse = {
        user: mockUser,
        token: response.token,
        expiresIn: 3600, // 1 hour
      };
      
      // Store authentication data
      authStorage.setToken(authResponse.token);
      authStorage.setUserData(authResponse.user);
      
      return authResponse;
    } catch (error) {
      // Clear any existing auth data on login failure
      authStorage.clearAll();
      throw error;
    }
  }

  /**
   * Register new user account
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // ReqRes API specific endpoint for registration
      const response = await apiService.post<{ id: number; token: string }>(
        '/register',
        {
          email: userData.email,
          password: userData.password,
        }
      );
      
      // Create a mock user object from registration data
      const mockUser: User = {
        id: response.id.toString(),
        email: userData.email,
        name: userData.name,
        createdAt: new Date().toISOString(),
      };
      
      const authResponse: AuthResponse = {
        user: mockUser,
        token: response.token,
        expiresIn: 3600, // 1 hour
      };
      
      // Store authentication data
      authStorage.setToken(authResponse.token);
      authStorage.setUserData(authResponse.user);
      
      return authResponse;
    } catch (error) {
      // Clear any existing auth data on registration failure
      authStorage.clearAll();
      throw error;
    }
  }

  /**
   * Logout user and clear session data
   */
  async logout(): Promise<void> {
    try {
      const token = authStorage.getToken();
      
      if (token) {
        // Attempt to notify server of logout
        await apiService.post('/auth/logout');
      }
    } catch (error) {
      // Continue with local logout even if server request fails
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local storage
      authStorage.clearAll();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = authStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await apiService.post<{ token: string; refreshToken?: string }>(
        '/auth/refresh',
        { refreshToken }
      );
      
      // Update stored tokens
      authStorage.setToken(response.token);
      
      if (response.refreshToken) {
        authStorage.setRefreshToken(response.refreshToken);
      }
      
      return response.token;
    } catch (error) {
      // Clear auth data if refresh fails
      authStorage.clearAll();
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    const updatedUser = await apiService.put<User>('/auth/profile', userData);
    
    // Update stored user data
    authStorage.setUserData(updatedUser);
    
    return updatedUser;
  }

  /**
   * Change user password
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiService.post('/auth/change-password', data);
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<void> {
    await apiService.post('/auth/reset-password', data);
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const token = authStorage.getToken();
    const userData = authStorage.getUserData();
    
    return !!(token && userData);
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    return authStorage.getUserData() as User | null;
  }

  /**
   * Get stored auth token
   */
  getStoredToken(): string | null {
    return authStorage.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
