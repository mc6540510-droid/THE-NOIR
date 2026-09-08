import { db, type DBRecord } from './database';

export interface User extends DBRecord {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    roastPreference?: string;
    flavorNotes?: string[];
    brewMethod?: string;
  };
  loyaltyPoints: number;
  subscriptionPlan?: 'explorer' | 'connoisseur' | 'collector';
  subscriptionStatus?: 'active' | 'paused' | 'cancelled';
  emailVerified: boolean;
  lastLogin?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  token: string;
  expiresAt: string;
}

class AuthService {
  private readonly SESSION_KEY = 'noir_session';
  private readonly TOKEN_EXPIRY_DAYS = 30;

  // Simple hash function (in production, use bcrypt on server)
  private async hashPassword(password: string): Promise<string> {
    // This is a simplified hash for demo purposes
    // In production, use bcryptjs or server-side hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'noir_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  private generateToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 16)}`;
  }

  private createSession(user: User): AuthSession {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);
    
    const session: AuthSession = {
      userId: user.id,
      email: user.email,
      token: this.generateToken(),
      expiresAt: expiresAt.toISOString(),
    };
    
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return session;
  }

  // Sign up
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Validate password
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Check if user exists
    const existingUsers = db.find<User>('users', u => u.email === email);
    if (existingUsers.length > 0) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = db.create<User>('users', {
      email,
      passwordHash,
      firstName,
      lastName,
      loyaltyPoints: 100, // Welcome bonus
      emailVerified: false,
    });

    // Create session
    this.createSession(user);

    return { success: true, user };
  }

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Find user
    const users = db.find<User>('users', u => u.email === email);
    if (users.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = users[0];

    // Verify password
    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    db.update('users', user.id, { lastLogin: new Date().toISOString() });

    // Create session
    this.createSession(user);

    return { success: true, user };
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Get current session
  getSession(): AuthSession | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;

    const session: AuthSession = JSON.parse(sessionData);
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      this.logout();
      return null;
    }

    return session;
  }

  // Get current user
  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) return null;

    return db.findById<User>('users', session.userId);
  }

  // Update user profile
  updateProfile(userId: string, updates: Partial<User>): User | null {
    return db.update<User>('users', userId, updates);
  }

  // Update password
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const user = db.findById<User>('users', userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const isValid = await this.verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Validate new password
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters' };
    }

    // Hash and update
    const newPasswordHash = await this.hashPassword(newPassword);
    db.update('users', userId, { passwordHash: newPasswordHash });

    return { success: true };
  }

  // Add loyalty points
  addLoyaltyPoints(userId: string, points: number): User | null {
    const user = db.findById<User>('users', userId);
    if (!user) return null;

    return db.update<User>('users', userId, {
      loyaltyPoints: user.loyaltyPoints + points,
    });
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

export const authService = new AuthService();
