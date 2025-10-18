import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { invoiceAPI, InvoiceDTO } from "@/services/api";
import { toast } from "sonner";
import { ArrowLeft, Receipt, Download, Search, FileText, Calendar, DollarSign, Eye } from "lucide-react";
import Header from "@/components/Header";

export default function Invoices() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch user's invoices
        const data = await invoiceAPI.getByUserId(user.id);
        setInvoices(data);
      } catch (error: any) {
        console.error("Failed to fetch invoices:", error);
        toast.error("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const filteredInvoices = invoices.filter((invoice) => {
    if (searchQuery === "") return true;

    const query = searchQuery.toLowerCase();
    return (
      invoice.invoiceID.toString().includes(query) ||
      invoice.carModel.toLowerCase().includes(query) ||
      invoice.status.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400";
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toFixed(2)}`;
  };

  const handleDownloadInvoice = (invoiceId: number) => {
    // TODO: Implement PDF download functionality
    toast.info("Download functionality will be implemented soon");
  };

  const handleViewInvoice = (invoiceId: number) => {
    // TODO: Navigate to detailed invoice view
    toast.info("Detailed invoice view will be implemented soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">My Invoices</h1>
            </div>
            <p className="text-muted-foreground">View and manage your rental invoices</p>
          </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice ID, car model, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Paid Invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {invoices.filter((inv) => inv.status.toUpperCase() === "PAID").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {invoices.filter((inv) => inv.status.toUpperCase() === "PENDING").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Invoices Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "You don't have any invoices yet"}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.invoiceID} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Invoice Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            Invoice #{invoice.invoiceID}
                          </span>
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Car Model:</span>
                          <span className="font-medium">{invoice.carModel}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Issue Date:</span>
                          <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(invoice.subTotal)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Tax:</span>
                          <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground font-semibold">Total:</span>
                          <span className="font-bold text-lg">{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.invoiceID)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.invoiceID)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        {filteredInvoices.length > 0 && (
          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
              <CardDescription>
                If you have questions about your invoices or need assistance with payment,
                please contact our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Contact Support
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}
