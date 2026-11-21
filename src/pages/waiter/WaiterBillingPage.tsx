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
  Banknote,
  QrCode,
  CheckCircle2,
  IdCard,
} from 'lucide-react'

export const WaiterBillingPage: React.FC = () => {
  const { invoices } = useBillingStore()
  const { currentUser } = useAuthStore()

  // Waiter identity - strictly enforced
  const waiterId = currentUser?.id || 'WTR001'
  const waiterName = currentUser?.name || 'Sophie Dubois'

  // Modals state
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null)
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null)
  const [isGenerateBillModalOpen, setIsGenerateBillModalOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Strict Data Isolation: only invoices assigned to this waiter
  const myInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.waiterId === waiterId)
  }, [invoices, waiterId])

  // KPI Calculations strictly for this waiter
  const metrics = useMemo(() => {
    let myTodayCollections = 0
    let myPendingBalance = 0
    let myCompletedBillsCount = 0

    myInvoices.forEach((inv) => {
      inv.payments.forEach((p) => {
        if (p.timestamp.startsWith(todayStr)) {
          myTodayCollections += p.amount
        }
      })

      if (inv.paymentStatus === 'Unpaid' || inv.paymentStatus === 'Partially Paid') {
        myPendingBalance += inv.remainingBalance
      }

      if (inv.paymentStatus === 'Paid') {
        myCompletedBillsCount += 1
      }
    })

    return {
      myTodayCollections,
      myPendingBalance,
      myCompletedBillsCount,
      totalBillsCount: myInvoices.length,
    }
  }, [myInvoices, todayStr])

  // Filtered invoices list
  const filteredInvoices = useMemo(() => {
    return myInvoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        q === '' ||
        inv.id.toLowerCase().includes(q) ||
        inv.orderId.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.tableNumber && inv.tableNumber.toLowerCase().includes(q))

      const matchesStatus =
        statusFilter === 'all' ||
        inv.paymentStatus.toLowerCase() === statusFilter.toLowerCase()

      const matchesMethod =
        methodFilter === 'all' ||
        (inv.paymentMethod && inv.paymentMethod.toLowerCase() === methodFilter.toLowerCase()) ||
        inv.payments.some((p) => p.method.toLowerCase() === methodFilter.toLowerCase())

      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [myInvoices, searchQuery, statusFilter, methodFilter])

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
        return <span className="text-secondary-text text-[11px] italic">Pending</span>
    }
  }

  return (
    <div className="space-y-8 text-left pb-10">
      {/* 1. Header */}
      <PageHeader
        title="Server Check & Settlement Terminal"
        subtitle={`Generate table checks, record guest cash/UPI payments, and print guest receipts for Server ${waiterName}.`}
        breadcrumbs={[
          { label: 'Staff' },
          { label: 'Waiter Portal' },
          { label: 'My Bills' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Waiter ID Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold/15 text-burgundy-dark border border-gold/30 text-xs font-semibold">
              <IdCard className="w-4 h-4 text-gold-dark" />
              <span>Server ID: <strong className="font-mono">{waiterId}</strong></span>
            </span>

            {/* Generate Bill CTA */}
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsGenerateBillModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-gold text-xs py-1.5"
            >
              Generate Table Bill
            </Button>
          </div>
        }
      />

      {/* 2. Overview Statistics (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Shift Collections"
          value={`₹${metrics.myTodayCollections.toLocaleString('en-IN')}`}
          change={{
            value: 'Today',
            isPositive: true,
            label: 'collected',
          }}
          description="Payments processed in your section"
          icon={Banknote}
        />

        <StatCard
          title="Outstanding Table Balance"
          value={`₹${metrics.myPendingBalance.toLocaleString('en-IN')}`}
          change={{
            value: `${myInvoices.filter((i) => i.remainingBalance > 0).length} open`,
            isPositive: metrics.myPendingBalance === 0,
            label: 'tables',
          }}
          description="Unsettled checks in your station"
          icon={Clock}
        />

        <StatCard
          title="Settled Invoices"
          value={`${metrics.myCompletedBillsCount} Paid`}
          change={{
            value: '100%',
            isPositive: true,
            label: 'reconciled',
          }}
          description="Fully paid customer checks"
          icon={CheckCircle2}
        />

        <StatCard
          title="Total Shift Tickets"
          value={`${metrics.totalBillsCount} Bills`}
          change={{
            value: `${waiterId}`,
            isPositive: true,
            label: 'server code',
          }}
          description="Invoices assigned to your section"
          icon={Receipt}
        />
      </div>

      {/* 3. Invoices List Container */}
      <div className="rounded-2xl bg-cream-card p-5 sm:p-6 border border-cream-border shadow-subtle space-y-5">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by invoice ID, order #, guest, or table..."
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl bg-cream px-3 py-2 text-xs font-semibold text-burgundy-dark border border-cream-border focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

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
          </div>
        </div>

        {/* Table */}
        {filteredInvoices.length === 0 ? (
          <EmptyState
            title="No Invoices For Your Section"
            description="You have no bills matching your current filter criteria."
            icon={Receipt}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setMethodFilter('all')
                }}
              >
                Reset Filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-cream-border bg-cream/40 text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Station</th>
                  <th className="py-3 px-4">Bill Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/70">
                {filteredInvoices.map((inv) => {
                  const isUnpaid = inv.paymentStatus === 'Unpaid'
                  const isPartial = inv.paymentStatus === 'Partially Paid'
                  const isPaid = inv.paymentStatus === 'Paid'

                  return (
                    <tr key={inv.id} className="transition-colors hover:bg-cream/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-burgundy-dark whitespace-nowrap">
                        {inv.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-secondary-text whitespace-nowrap">
                        {inv.orderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-burgundy-dark block">{inv.customerName}</span>
                        {inv.customerPhone && (
                          <span className="text-[10px] text-secondary-text font-mono">{inv.customerPhone}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-burgundy-dark text-xs block">
                          {inv.tableNumber || inv.orderType}
                        </span>
                      </td>
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
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getMethodBadge(inv.paymentMethod)}
                      </td>
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
                      <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {inv.invoiceTime}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInvoiceForView(inv)}
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                            className="py-1 px-2.5 text-xs font-semibold"
                          >
                            Receipt
                          </Button>
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

      {/* Modals */}
      {selectedInvoiceForView && (
        <InvoiceViewModal
          isOpen={!!selectedInvoiceForView}
          onClose={() => setSelectedInvoiceForView(null)}
          invoice={
            invoices.find((i) => i.id === selectedInvoiceForView.id) ||
            selectedInvoiceForView
          }
          userRole="waiter"
          onRecordPaymentClick={(inv) => {
            setSelectedInvoiceForView(null)
            setSelectedInvoiceForPayment(inv)
          }}
        />
      )}

      {selectedInvoiceForPayment && (
        <RecordPaymentModal
          isOpen={!!selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          invoice={
            invoices.find((i) => i.id === selectedInvoiceForPayment.id) ||
            selectedInvoiceForPayment
          }
          staffId={waiterId}
          staffName={waiterName}
          onPaymentRecorded={(updated) => {
            setSelectedInvoiceForView(updated)
          }}
        />
      )}

      {isGenerateBillModalOpen && (
        <GenerateBillModal
          isOpen={isGenerateBillModalOpen}
          onClose={() => setIsGenerateBillModalOpen(false)}
          staffId={waiterId}
          staffName={waiterName}
          userRole="waiter"
          onInvoiceGenerated={(newInv) => {
            setSelectedInvoiceForView(newInv)
          }}
        />
      )}
    </div>
  )
}
