import React, { useState, useMemo } from 'react'
import {
  PageHeader,
  StatCard,
  Button,
  SearchBar,
  StatusBadge,
  EmptyState,
} from '@/components/common'
import {
  InvoiceViewModal,
  RecordPaymentModal,
  GenerateBillModal,
  RefundModal,
  TaxConfigModal,
} from '@/components/billing'
import { useBillingStore } from '@/store/useBillingStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Invoice, PaymentMethod } from '@/types/billing'
import {
  Receipt,
  Plus,
  Eye,
  CreditCard,
  Clock,
  RotateCcw,
  Settings,
  Banknote,
  QrCode,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'

export const AdminBillingPage: React.FC = () => {
  const { invoices, taxConfig, resetToInitialDemo } = useBillingStore()
  const { currentUser } = useAuthStore()

  const adminName = currentUser?.name || 'Laurent Moreau'
  const adminId = currentUser?.id || 'ADM001'

  // Modals state
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null)
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null)
  const [selectedInvoiceForRefund, setSelectedInvoiceForRefund] = useState<Invoice | null>(null)
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false)
  const [isTaxConfigModalOpen, setIsTaxConfigModalOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today'>('all')

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // KPI Calculations
  const metrics = useMemo(() => {
    let todayRevenue = 0
    let totalPaymentsReceived = 0
    let pendingPayments = 0
    let completedBillsCount = 0
    let refundAmount = 0
    let refundCount = 0

    invoices.forEach((inv) => {
      // Payments received total
      inv.payments.forEach((p) => {
        totalPaymentsReceived += p.amount
        if (p.timestamp.startsWith(todayStr)) {
          todayRevenue += p.amount
        }
      })

      // Pending payments
      if (inv.paymentStatus === 'Unpaid' || inv.paymentStatus === 'Partially Paid') {
        pendingPayments += inv.remainingBalance
      }

      // Completed bills
      if (inv.paymentStatus === 'Paid') {
        completedBillsCount += 1
      }

      // Refunds
      if (inv.paymentStatus === 'Refunded') {
        refundCount += 1
        refundAmount += inv.totalAmount
      }
    })

    return {
      todayRevenue,
      totalPaymentsReceived,
      pendingPayments,
      completedBillsCount,
      refundAmount,
      refundCount,
    }
  }, [invoices, todayStr])

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        inv.id.toLowerCase().includes(q) ||
        inv.orderId.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.customerPhone && inv.customerPhone.includes(q)) ||
        (inv.tableNumber && inv.tableNumber.toLowerCase().includes(q)) ||
        inv.waiterName.toLowerCase().includes(q)

      // 2. Status Filter
      const matchesStatus =
        statusFilter === 'all' ||
        inv.paymentStatus.toLowerCase() === statusFilter.toLowerCase()

      // 3. Method Filter
      const matchesMethod =
        methodFilter === 'all' ||
        (inv.paymentMethod && inv.paymentMethod.toLowerCase() === methodFilter.toLowerCase()) ||
        inv.payments.some((p) => p.method.toLowerCase() === methodFilter.toLowerCase())

      // 4. Date Filter
      const matchesDate =
        dateFilter === 'all' ||
        inv.createdAt.startsWith(todayStr)

      return matchesSearch && matchesStatus && matchesMethod && matchesDate
    })
  }, [invoices, searchQuery, statusFilter, methodFilter, dateFilter, todayStr])

  // Status Counts for Tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: invoices.length,
      paid: 0,
      partially_paid: 0,
      unpaid: 0,
      refunded: 0,
    }

    invoices.forEach((inv) => {
      if (inv.paymentStatus === 'Paid') counts.paid += 1
      else if (inv.paymentStatus === 'Partially Paid') counts.partially_paid += 1
      else if (inv.paymentStatus === 'Unpaid') counts.unpaid += 1
      else if (inv.paymentStatus === 'Refunded') counts.refunded += 1
    })

    return counts
  }, [invoices])

  const getMethodBadge = (method?: PaymentMethod) => {
    switch (method) {
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Banknote className="w-3 h-3 text-emerald-600" /> Cash
          </span>
        )
      case 'UPI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <QrCode className="w-3 h-3 text-sky-600" /> UPI
          </span>
        )
      case 'Card':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <CreditCard className="w-3 h-3 text-purple-600" /> Card
          </span>
        )
      default:
        return (
          <span className="text-secondary-text text-[11px] italic">
            Pending
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Page Header */}
      <PageHeader
        title="Billing & Payment Terminal"
        subtitle="Manage restaurant checks, record manual payments, review cash/UPI settlements, and configure tax rates."
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Billing & POS' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tax Settings CTA */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTaxConfigModalOpen(true)}
              leftIcon={<Settings className="w-3.5 h-3.5 text-gold-dark" />}
              className="py-1.5 px-3 text-xs"
            >
              GST: {taxConfig.gstRate}%
            </Button>

            {/* Reset Demo Invoices */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetToInitialDemo}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="py-1.5 px-3 text-xs text-secondary-text hover:text-burgundy"
            >
              Reset Demo
            </Button>

            {/* Generate Bill CTA */}
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsGenerateBillModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-gold text-xs py-1.5"
            >
              Generate Bill
            </Button>
          </div>
        }
      />

      {/* 2. Overview Statistics (5 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Today's Revenue */}
        <StatCard
          title="Today's Revenue"
          value={`₹${metrics.todayRevenue.toLocaleString('en-IN')}`}
          change={{
            value: '+14.2%',
            isPositive: true,
            label: 'vs yesterday',
          }}
          description="Settled check collections today"
          icon={TrendingUp}
        />

        {/* Card 2: Total Payments Received */}
        <StatCard
          title="Total Collections"
          value={`₹${metrics.totalPaymentsReceived.toLocaleString('en-IN')}`}
          change={{
            value: 'All-time',
            isPositive: true,
            label: 'recorded',
          }}
          description="Sum of all cash, UPI & card receipts"
          icon={Banknote}
        />

        {/* Card 3: Pending Payments */}
        <StatCard
          title="Pending Payments"
          value={`₹${metrics.pendingPayments.toLocaleString('en-IN')}`}
          change={{
            value: `${statusCounts.unpaid + statusCounts.partially_paid} open`,
            isPositive: metrics.pendingPayments === 0,
            label: 'bills',
          }}
          description="Unpaid & partial check balance"
          icon={Clock}
        />

        {/* Card 4: Completed Bills */}
        <StatCard
          title="Completed Bills"
          value={`${metrics.completedBillsCount} Bills`}
          change={{
            value: '100%',
            isPositive: true,
            label: 'settlement rate',
          }}
          description="Fully paid and reconciled invoices"
          icon={CheckCircle2}
        />

        {/* Card 5: Refunds */}
        <StatCard
          title="Refunds Recorded"
          value={`₹${metrics.refundAmount.toLocaleString('en-IN')}`}
          change={{
            value: `${metrics.refundCount} invoices`,
            isPositive: metrics.refundCount === 0,
            label: 'refunded',
          }}
          description="Customer departure returns"
          icon={RotateCcw}
        />
      </div>

      {/* 3. Search, Filters, & Table Container */}
      <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle space-y-5">
        {/* Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by invoice ID, order #, guest, or table..."
              />
            </div>

            {/* Quick Method & Date Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Payment Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-burgundy-dark border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'today')}
                className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-burgundy-dark border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-cream-border/70">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-burgundy text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text hover:text-burgundy'
              }`}
            >
              All Invoices ({statusCounts.all})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('Paid')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'Paid'
                  ? 'bg-emerald-700 text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text hover:text-emerald-800'
              }`}
            >
              Paid ({statusCounts.paid})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('Partially Paid')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'Partially Paid'
                  ? 'bg-amber-600 text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text hover:text-amber-800'
              }`}
            >
              Partially Paid ({statusCounts.partially_paid})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('Unpaid')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'Unpaid'
                  ? 'bg-rose-700 text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text hover:text-rose-800'
              }`}
            >
              Unpaid ({statusCounts.unpaid})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('Refunded')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'Refunded'
                  ? 'bg-stone-700 text-cream shadow-2xs'
                  : 'bg-cream text-secondary-text hover:text-stone-800'
              }`}
            >
              Refunded ({statusCounts.refunded})
            </button>
          </div>
        </div>

        {/* 4. Transactions Table */}
        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No Invoices Found"
            description="No billing records match your search query or selected filters."
            icon={Receipt}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setMethodFilter('all')
                  setDateFilter('all')
                }}
              >
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Station / Type</th>
                  <th className="py-3 px-4">Bill Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/70">
                {filteredInvoices.map((inv) => {
                  const isUnpaid = inv.paymentStatus === 'Unpaid'
                  const isPartial = inv.paymentStatus === 'Partially Paid'
                  const isPaid = inv.paymentStatus === 'Paid'

                  return (
                    <tr
                      key={inv.id}
                      className="transition-colors hover:bg-cream/40"
                    >
                      {/* Invoice ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                        {inv.id}
                      </td>

                      {/* Order ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-secondary-text whitespace-nowrap">
                        {inv.orderId}
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-burgundy-dark">{inv.customerName}</p>
                        {inv.customerPhone && (
                          <p className="text-[10px] text-secondary-text font-mono">
                            {inv.customerPhone}
                          </p>
                        )}
                      </td>

                      {/* Station / Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-burgundy-dark text-xs block">
                          {inv.tableNumber || inv.orderType}
                        </span>
                        <span className="text-[10px] text-secondary-text">
                          Server: {inv.waiterName}
                        </span>
                      </td>

                      {/* Bill Amount with Balance */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-display font-bold text-burgundy-dark text-sm">
                          ₹{inv.totalAmount.toLocaleString('en-IN')}
                        </p>
                        {isPartial && (
                          <span className="text-[10px] text-amber-800 font-semibold block">
                            Due: ₹{inv.remainingBalance.toLocaleString('en-IN')}
                          </span>
                        )}
                        {isUnpaid && (
                          <span className="text-[10px] text-rose-700 font-medium block">
                            Full Due
                          </span>
                        )}
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getMethodBadge(inv.paymentMethod)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge
                          status={
                            isPaid
                              ? 'completed'
                              : isPartial
                              ? 'preparing'
                              : inv.paymentStatus === 'Refunded'
                              ? 'cancelled'
                              : 'pending'
                          }
                          label={inv.paymentStatus}
                        />
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {inv.invoiceTime}
                        </span>
                        <span className="text-[10px] text-secondary-text block">
                          {inv.invoiceDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Collect Payment (for unpaid/partially paid) */}
                          {(isUnpaid || isPartial) && (
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                              className="py-1 px-2.5 text-xs shadow-gold"
                            >
                              Collect
                            </Button>
                          )}

                          {/* View Invoice */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInvoiceForView(inv)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            className="py-1 px-2.5 text-xs font-semibold"
                          >
                            View
                          </Button>

                          {/* Refund (Admin only, if paid) */}
                          {isPaid && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedInvoiceForRefund(inv)}
                              leftIcon={<RotateCcw className="w-3 h-3 text-rose-600" />}
                              className="py-1 px-2 text-xs text-rose-700 hover:bg-rose-50"
                              title="Refund Invoice"
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. View / Print Invoice Modal */}
      {selectedInvoiceForView && (
        <InvoiceViewModal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          invoice={
            invoices.find((i) => i.id === selectedInvoiceForView.id) ||
            selectedInvoiceForView
          }
          userRole="admin"
          onRecordPaymentClick={(inv) => {
            setSelectedInvoiceForView(null)
            setSelectedInvoiceForPayment(inv)
          }}
          onRefundClick={(inv) => {
            setSelectedInvoiceForView(null)
            setSelectedInvoiceForRefund(inv)
          }}
        />
      )}

      {/* 2. Record Payment Modal */}
      {selectedInvoiceForPayment && (
        <RecordPaymentModal
          isOpen={!!selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          invoice={
            invoices.find((i) => i.id === selectedInvoiceForPayment.id) ||
            selectedInvoiceForPayment
          }
          staffId={adminId}
          staffName={adminName}
          onPaymentRecorded={(updated) => {
            setSelectedInvoiceForView(updated)
          }}
        />
      )}

      {/* 3. Generate Bill Modal */}
      {isGenerateBillModalOpen && (
        <GenerateBillModal
          isOpen={isGenerateBillModalOpen}
          onClose={() => setIsGenerateBillModalOpen(false)}
          staffId={adminId}
          staffName={adminName}
          userRole="admin"
          onInvoiceGenerated={(newInv) => {
            setSelectedInvoiceForView(newInv)
          }}
        />
      )}

      {/* 4. Refund Modal */}
      {selectedInvoiceForRefund && (
        <RefundModal
          isOpen={!!selectedInvoiceForRefund}
          onClose={() => setSelectedInvoiceForRefund(null)}
          invoice={selectedInvoiceForRefund}
          staffId={adminId}
          staffName={adminName}
          onRefundProcessed={(updated) => {
            setSelectedInvoiceForView(updated)
          }}
        />
      )}

      {/* 5. Tax Config Modal */}
      {isTaxConfigModalOpen && (
        <TaxConfigModal
          isOpen={isTaxConfigModalOpen}
          onClose={() => setIsTaxConfigModalOpen(false)}
        />
      )}
    </div>
  )
}
