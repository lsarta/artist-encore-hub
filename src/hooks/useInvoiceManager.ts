import { useState } from "react";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  type: 'venue' | 'label' | 'artist' | 'supervisor' | 'student' | 'other';
  notes?: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: 'performance' | 'recording' | 'collaboration' | 'merchandise' | 'licensing' | 'teaching' | 'session';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  paymentTerms: string;
  paymentMethod?: string;
  paidDate?: string;
  sentDate?: string;
  viewedDate?: string;
  remindersSent: number;
  lastReminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceStats {
  totalOutstanding: number;
  paidThisMonth: number;
  overdueAmount: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  avgPaymentTime: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Blue Note Jazz Club",
    email: "booking@bluenote.com",
    phone: "(212) 555-0123",
    address: "131 W 3rd St",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    type: "venue",
    createdAt: "2024-01-01"
  },
  {
    id: "2",
    name: "Atlantic Records",
    email: "payments@atlantic.com",
    phone: "(212) 555-0456",
    type: "label",
    createdAt: "2024-01-15"
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.j.music@gmail.com",
    phone: "(555) 123-4567",
    type: "artist",
    notes: "Collaboration on upcoming album",
    createdAt: "2024-02-01"
  }
];

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    clientId: "1",
    clientName: "Blue Note Jazz Club",
    status: "paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-14",
    items: [
      {
        id: "1",
        description: "Live Performance - Evening Show",
        quantity: 1,
        rate: 2500,
        amount: 2500,
        category: "performance"
      },
      {
        id: "2",
        description: "Sound Check & Rehearsal",
        quantity: 2,
        rate: 200,
        amount: 400,
        category: "performance"
      }
    ],
    subtotal: 2900,
    taxRate: 0.0875,
    taxAmount: 253.75,
    total: 3153.75,
    paymentTerms: "Net 30",
    paymentMethod: "Wire Transfer",
    paidDate: "2024-02-10",
    sentDate: "2024-01-15",
    viewedDate: "2024-01-16",
    remindersSent: 0,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-10"
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    clientId: "2",
    clientName: "Atlantic Records",
    status: "sent",
    issueDate: "2024-02-01",
    dueDate: "2024-03-02",
    items: [
      {
        id: "1",
        description: "Studio Session - Lead Vocals",
        quantity: 8,
        rate: 150,
        amount: 1200,
        category: "recording"
      },
      {
        id: "2",
        description: "Songwriting Credit",
        quantity: 1,
        rate: 5000,
        amount: 5000,
        category: "collaboration"
      }
    ],
    subtotal: 6200,
    taxRate: 0.0875,
    taxAmount: 542.50,
    total: 6742.50,
    paymentTerms: "Net 30",
    sentDate: "2024-02-01",
    viewedDate: "2024-02-03",
    remindersSent: 1,
    lastReminderDate: "2024-02-20",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-20"
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    clientId: "3",
    clientName: "Sarah Johnson",
    status: "overdue",
    issueDate: "2024-01-20",
    dueDate: "2024-02-19",
    items: [
      {
        id: "1",
        description: "Music Production Services",
        quantity: 40,
        rate: 100,
        amount: 4000,
        category: "recording"
      }
    ],
    subtotal: 4000,
    taxRate: 0.0875,
    taxAmount: 350,
    total: 4350,
    paymentTerms: "Net 30",
    sentDate: "2024-01-20",
    viewedDate: "2024-01-22",
    remindersSent: 2,
    lastReminderDate: "2024-02-25",
    createdAt: "2024-01-20",
    updatedAt: "2024-02-25"
  }
];

export const useInvoiceManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [clients, setClients] = useState<Client[]>(mockClients);

  const getInvoiceStats = (): InvoiceStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const outstanding = invoices
      .filter(inv => ['sent', 'viewed', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.total, 0);

    const paidThisMonth = invoices
      .filter(inv => {
        if (!inv.paidDate) return false;
        const paidDate = new Date(inv.paidDate);
        return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const overdue = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const avgPaymentTime = paidInvoices.length > 0 
      ? paidInvoices.reduce((sum, inv) => {
          if (!inv.paidDate) return sum;
          const issued = new Date(inv.issueDate);
          const paid = new Date(inv.paidDate);
          return sum + (paid.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / paidInvoices.length
      : 0;

    const thisMonthRevenue = invoices
      .filter(inv => {
        const issueDate = new Date(inv.issueDate);
        return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    const lastMonthRevenue = invoices
      .filter(inv => {
        const issueDate = new Date(inv.issueDate);
        return issueDate.getMonth() === lastMonth && issueDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalOutstanding: outstanding,
      paidThisMonth,
      overdueAmount: overdue,
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      overdueInvoices: overdueInvoices.length,
      avgPaymentTime,
      thisMonthRevenue,
      lastMonthRevenue
    };
  };

  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === id 
          ? { ...invoice, ...updates, updatedAt: new Date().toISOString() }
          : invoice
      )
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  const markAsPaid = (id: string, paidDate: string, paymentMethod: string) => {
    updateInvoice(id, {
      status: 'paid',
      paidDate,
      paymentMethod
    });
  };

  const sendReminder = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      updateInvoice(id, {
        remindersSent: invoice.remindersSent + 1,
        lastReminderDate: new Date().toISOString()
      });
    }
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => 
      prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      )
    );
  };

  const getClientById = (id: string): Client | undefined => {
    return clients.find(client => client.id === id);
  };

  const getInvoicesByStatus = (status: Invoice['status']) => {
    return invoices.filter(invoice => invoice.status === status);
  };

  const getInvoicesByDateRange = (startDate: string, endDate: string) => {
    return invoices.filter(invoice => {
      const issueDate = new Date(invoice.issueDate);
      return issueDate >= new Date(startDate) && issueDate <= new Date(endDate);
    });
  };

  const searchInvoices = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return invoices.filter(invoice => 
      invoice.invoiceNumber.toLowerCase().includes(lowerQuery) ||
      invoice.clientName.toLowerCase().includes(lowerQuery) ||
      invoice.items.some(item => item.description.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    invoices,
    clients,
    getInvoiceStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    sendReminder,
    addClient,
    updateClient,
    getClientById,
    getInvoicesByStatus,
    getInvoicesByDateRange,
    searchInvoices
  };
};