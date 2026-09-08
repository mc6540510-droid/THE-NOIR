import { db, type DBRecord } from './database';

export interface NewsletterSubscriber extends DBRecord {
  email: string;
  firstName?: string;
  interests: string[];
  subscribedAt: string;
  unsubscribedAt?: string;
  status: 'active' | 'unsubscribed';
}

export interface ContactSubmission extends DBRecord {
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  respondedAt?: string;
}

class NewsletterService {
  private readonly NEWSLETTER_COLLECTION = 'newsletter';

  // Subscribe
  subscribe(email: string, firstName?: string, interests: string[] = []): { success: boolean; error?: string } {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    // Check if already subscribed
    const existing = db.find<NewsletterSubscriber>(this.NEWSLETTER_COLLECTION, 
      sub => sub.email === email && sub.status === 'active'
    );
    if (existing.length > 0) {
      return { success: false, error: 'Email already subscribed' };
    }

    db.create<NewsletterSubscriber>(this.NEWSLETTER_COLLECTION, {
      email,
      firstName,
      interests,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return { success: true };
  }

  // Unsubscribe
  unsubscribe(email: string): boolean {
    const subscribers = db.find<NewsletterSubscriber>(this.NEWSLETTER_COLLECTION, 
      sub => sub.email === email && sub.status === 'active'
    );
    if (subscribers.length === 0) return false;

    db.update(this.NEWSLETTER_COLLECTION, subscribers[0].id, {
      status: 'unsubscribed',
      unsubscribedAt: new Date().toISOString(),
    });

    return true;
  }

  // Get subscriber count
  getSubscriberCount(): number {
    return db.find<NewsletterSubscriber>(this.NEWSLETTER_COLLECTION, 
      sub => sub.status === 'active'
    ).length;
  }
}

class ContactService {
  private readonly CONTACT_COLLECTION = 'contact_submissions';

  // Submit contact form
  submit(name: string, email: string, message: string, subject?: string): { success: boolean; error?: string } {
    // Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email address' };
    }
    if (!name.trim()) {
      return { success: false, error: 'Name is required' };
    }
    if (!message.trim()) {
      return { success: false, error: 'Message is required' };
    }

    db.create<ContactSubmission>(this.CONTACT_COLLECTION, {
      name,
      email,
      subject,
      message,
      status: 'new',
    });

    return { success: true };
  }

  // Get all submissions (admin)
  getSubmissions(): ContactSubmission[] {
    return db.findAll<ContactSubmission>(this.CONTACT_COLLECTION)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Mark as read
  markAsRead(id: string): void {
    db.update(this.CONTACT_COLLECTION, id, { status: 'read' });
  }

  // Mark as responded
  markAsResponded(id: string): void {
    db.update(this.CONTACT_COLLECTION, id, { 
      status: 'responded',
      respondedAt: new Date().toISOString(),
    });
  }
}

export const newsletterService = new NewsletterService();
export const contactService = new ContactService();
