import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  FileText,
  Mail,
  Phone,
  MapPin,
  Building,
  Music,
  Mic,
  Headphones,
  GraduationCap
} from "lucide-react";
import { useInvoiceManager, Invoice, Client } from "@/hooks/useInvoiceManager";
import { useToast } from "@/hooks/use-toast";

interface InvoiceManagerProps {
  onBack: () => void;
}

type ViewMode = 'dashboard' | 'invoices' | 'clients' | 'create' | 'edit';

export const InvoiceManager = ({ onBack }: InvoiceManagerProps) => {
  const {
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
    searchInvoices
  } = useInvoiceManager();
  
  const { toast } = useToast();
  const stats = getInvoiceStats();
  
  // State management
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);

  // Invoice creation form state
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Net 30',
    notes: '',
    taxRate: 8.75,
    items: [{
      id: '1',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      category: 'performance' as const
    }]
  });

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    type: 'venue' as Client['type'],
    notes: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'sent': return 'bg-blue-500';
      case 'viewed': return 'bg-purple-500';
      case 'paid': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getClientTypeIcon = (type: Client['type']) => {
    switch (type) {
      case 'venue': return Building;
      case 'label': return Music;
      case 'artist': return Mic;
      case 'supervisor': return Headphones;
      case 'student': return GraduationCap;
      default: return Users;
    }
  };

  const calculateDueDate = (issueDate: string, terms: string) => {
    const date = new Date(issueDate);
    const days = terms === 'Net 15' ? 15 : terms === 'Net 30' ? 30 : terms === 'Net 60' ? 60 : 30;
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const calculateItemAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const calculateSubtotal = () => {
    return invoiceForm.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * (invoiceForm.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const addInvoiceItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      category: 'performance' as const
    };
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateInvoiceItem = (id: string, field: string, value: any) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = calculateItemAmount(
              field === 'quantity' ? value : updated.quantity,
              field === 'rate' ? value : updated.rate
            );
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeInvoiceItem = (id: string) => {
    if (invoiceForm.items.length > 1) {
      setInvoiceForm(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const handleCreateInvoice = () => {
    if (!invoiceForm.clientId) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive"
      });
      return;
    }

    const client = getClientById(invoiceForm.clientId);
    if (!client) return;

    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax(subtotal);
    const total = subtotal + taxAmount;

    const newInvoice = createInvoice({
      clientId: invoiceForm.clientId,
      clientName: client.name,
      status: 'draft',
      issueDate: invoiceForm.issueDate,
      dueDate: invoiceForm.dueDate,
      items: invoiceForm.items,
      subtotal,
      taxRate: invoiceForm.taxRate / 100,
      taxAmount,
      total,
      notes: invoiceForm.notes,
      paymentTerms: invoiceForm.paymentTerms,
      remindersSent: 0
    });

    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.invoiceNumber} has been created successfully.`
    });

    setCurrentView('invoices');
    // Reset form
    setInvoiceForm({
      clientId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      paymentTerms: 'Net 30',
      notes: '',
      taxRate: 8.75,
      items: [{
        id: '1',
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
        category: 'performance'
      }]
    });
  };

  const handleCreateClient = () => {
    if (!clientForm.name || !clientForm.email) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name and email)",
        variant: "destructive"
      });
      return;
    }

    const newClient = addClient(clientForm);
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added to your clients.`
    });

    setShowClientDialog(false);
    // Reset form
    setClientForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      type: 'venue',
      notes: ''
    });
  };

  const filteredInvoices = () => {
    let filtered = invoices;
    
    if (statusFilter !== 'all') {
      filtered = getInvoicesByStatus(statusFilter);
    }
    
    if (searchQuery) {
      filtered = searchInvoices(searchQuery);
    }
    
    return filtered;
  };

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="text-accent hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Invoice Management</h1>
              <p className="text-muted-foreground">Manage your business billing and client payments</p>
            </div>
            <Button onClick={() => setCurrentView('create')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                  <p className="text-3xl font-bold text-orange-500">{formatCurrency(stats.totalOutstanding)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                  <p className="text-3xl font-bold text-green-500">{formatCurrency(stats.paidThisMonth)}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-3xl font-bold text-red-500">{formatCurrency(stats.overdueAmount)}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue Growth</p>
                  <p className="text-3xl font-bold">
                    {stats.lastMonthRevenue > 0 
                      ? Math.round(((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100)
                      : 0}%
                  </p>
                </div>
                {stats.thisMonthRevenue >= stats.lastMonthRevenue ? (
                  <TrendingUp className="w-8 h-8 text-green-500" />
                ) : (
                  <TrendingDown className="w-8 h-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('invoices')}>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">View All Invoices</h3>
              <p className="text-sm text-muted-foreground">{stats.totalInvoices} total invoices</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('clients')}>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Manage Clients</h3>
              <p className="text-sm text-muted-foreground">{clients.length} active clients</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('create')}>
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Create Invoice</h3>
              <p className="text-sm text-muted-foreground">New invoice</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(invoice.status)}`} />
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(invoice.total)}</p>
                    <p className="text-sm text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invoice List View
  if (currentView === 'invoices') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-accent hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Invoices</h1>
              <p className="text-muted-foreground">Manage all your invoices and track payments</p>
            </div>
            <Button onClick={() => setCurrentView('create')} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Invoice #</th>
                    <th className="text-left p-4 font-medium">Client</th>
                    <th className="text-left p-4 font-medium">Amount</th>
                    <th className="text-left p-4 font-medium">Issue Date</th>
                    <th className="text-left p-4 font-medium">Due Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices().map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">{invoice.invoiceNumber}</td>
                      <td className="p-4">{invoice.clientName}</td>
                      <td className="p-4 font-medium">{formatCurrency(invoice.total)}</td>
                      <td className="p-4">{formatDate(invoice.issueDate)}</td>
                      <td className="p-4">{formatDate(invoice.dueDate)}</td>
                      <td className="p-4">
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' :
                          invoice.status === 'overdue' ? 'destructive' :
                          'secondary'
                        }>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.status !== 'paid' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowPaymentDialog(true);
                              }}
                            >
                              <DollarSign className="w-4 h-4" />
                            </Button>
                          )}
                          {['sent', 'viewed', 'overdue'].includes(invoice.status) && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                sendReminder(invoice.id);
                                toast({
                                  title: "Reminder Sent",
                                  description: `Payment reminder sent to ${invoice.clientName}`
                                });
                              }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create Invoice View
  if (currentView === 'create') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-accent hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create New Invoice</h1>
          <p className="text-muted-foreground">Fill in the details to create a professional invoice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="client">Select Client</Label>
                    <Select value={invoiceForm.clientId} onValueChange={(value) => setInvoiceForm(prev => ({ ...prev, clientId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a client..." />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowClientDialog(true)}
                    className="mt-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      type="date"
                      value={invoiceForm.issueDate}
                      onChange={(e) => {
                        const newIssueDate = e.target.value;
                        setInvoiceForm(prev => ({
                          ...prev,
                          issueDate: newIssueDate,
                          dueDate: calculateDueDate(newIssueDate, prev.paymentTerms)
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select 
                      value={invoiceForm.paymentTerms} 
                      onValueChange={(value) => {
                        setInvoiceForm(prev => ({
                          ...prev,
                          paymentTerms: value,
                          dueDate: calculateDueDate(prev.issueDate, value)
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                        <SelectItem value="Net 15">Net 15</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    type="date"
                    value={invoiceForm.dueDate}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>Services & Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoiceForm.items.map((item, index) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {invoiceForm.items.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeInvoiceItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Service description..."
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select 
                          value={item.category} 
                          onValueChange={(value) => updateInvoiceItem(item.id, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">Live Performance</SelectItem>
                            <SelectItem value="recording">Recording Services</SelectItem>
                            <SelectItem value="collaboration">Collaboration</SelectItem>
                            <SelectItem value="merchandise">Merchandise</SelectItem>
                            <SelectItem value="licensing">Licensing</SelectItem>
                            <SelectItem value="teaching">Teaching/Workshops</SelectItem>
                            <SelectItem value="session">Session Work</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label>Rate ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          value={formatCurrency(item.amount)}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addInvoiceItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    placeholder="Additional notes or payment instructions..."
                    value={invoiceForm.notes}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={invoiceForm.taxRate}
                    onChange={(e) => setInvoiceForm(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({invoiceForm.taxRate}%):</span>
                    <span>{formatCurrency(calculateTax(calculateSubtotal()))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <p><strong>Payment Terms:</strong> {invoiceForm.paymentTerms}</p>
                  <p><strong>Due Date:</strong> {invoiceForm.dueDate ? formatDate(invoiceForm.dueDate) : 'Not set'}</p>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button onClick={handleCreateInvoice} className="w-full">
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Client Dialog */}
        <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  placeholder="Client name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Client Type</Label>
                <Select value={clientForm.type} onValueChange={(value) => setClientForm(prev => ({ ...prev, type: value as Client['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venue">Venue</SelectItem>
                    <SelectItem value="label">Record Label</SelectItem>
                    <SelectItem value="artist">Artist/Collaborator</SelectItem>
                    <SelectItem value="supervisor">Music Supervisor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  placeholder="Street address"
                  value={clientForm.address}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  placeholder="City"
                  value={clientForm.city}
                  onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  placeholder="State"
                  value={clientForm.state}
                  onChange={(e) => setClientForm(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  placeholder="Additional notes about this client..."
                  value={clientForm.notes}
                  onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateClient} className="flex-1">
                Add Client
              </Button>
              <Button variant="outline" onClick={() => setShowClientDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Invoice as Paid</DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.clientName}</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedInvoice.total)}</p>
                </div>
                <div>
                  <Label htmlFor="paymentDate">Payment Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Credit Card</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                      <SelectItem value="zelle">Zelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      markAsPaid(selectedInvoice.id, new Date().toISOString(), 'Wire Transfer');
                      setShowPaymentDialog(false);
                      toast({
                        title: "Payment Recorded",
                        description: `Invoice ${selectedInvoice.invoiceNumber} marked as paid`
                      });
                    }}
                    className="flex-1"
                  >
                    Mark as Paid
                  </Button>
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Clients View
  if (currentView === 'clients') {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-accent hover:underline mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Clients</h1>
              <p className="text-muted-foreground">Manage your client relationships and contact information</p>
            </div>
            <Button onClick={() => setShowClientDialog(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const IconComponent = getClientTypeIcon(client.type);
            const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
            const totalOwed = clientInvoices
              .filter(inv => ['sent', 'viewed', 'overdue'].includes(inv.status))
              .reduce((sum, inv) => sum + inv.total, 0);
            
            return (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {client.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{client.city}, {client.state}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Invoices</p>
                      <p className="font-semibold">{clientInvoices.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Owed</p>
                      <p className="font-semibold">{formatCurrency(totalOwed)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentView('create')}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Client Dialog */}
        <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  placeholder="Client name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="type">Client Type</Label>
                <Select value={clientForm.type} onValueChange={(value) => setClientForm(prev => ({ ...prev, type: value as Client['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venue">Venue</SelectItem>
                    <SelectItem value="label">Record Label</SelectItem>
                    <SelectItem value="artist">Artist/Collaborator</SelectItem>
                    <SelectItem value="supervisor">Music Supervisor</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  placeholder="Street address"
                  value={clientForm.address}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  placeholder="City"
                  value={clientForm.city}
                  onChange={(e) => setClientForm(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  placeholder="State"
                  value={clientForm.state}
                  onChange={(e) => setClientForm(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  placeholder="Additional notes about this client..."
                  value={clientForm.notes}
                  onChange={(e) => setClientForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateClient} className="flex-1">
                Add Client
              </Button>
              <Button variant="outline" onClick={() => setShowClientDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return null;
};