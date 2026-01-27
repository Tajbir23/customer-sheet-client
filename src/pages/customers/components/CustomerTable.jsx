import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import handleApi from '../../../libs/handleAPi';
import CustomerDetailsModal from './CustomerDetailsModal';
import DeleteCustomerModal from './DeleteCustomerModal';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import Pagination from './Pagination';
import PageSizeSelector from './PageSizeSelector';
import jsPDF from 'jspdf';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

const TableSkeleton = () => {
    return (
        <div className="animate-pulse p-6">
            {/* Header Skeleton */}
            <div className="h-12 skeleton rounded-xl mb-4" />

            {/* Row Skeletons */}
            {[1, 2, 3, 4, 5].map((item) => (
                <div
                    key={item}
                    className="flex space-x-4 py-4 border-b border-[var(--border-subtle)]"
                    style={{ animationDelay: `${item * 100}ms` }}
                >
                    <div className="h-10 skeleton rounded-lg w-1/6" />
                    <div className="h-10 skeleton rounded-lg w-1/5" />
                    <div className="h-10 skeleton rounded-lg w-1/6" />
                    <div className="h-10 skeleton rounded-lg w-1/6" />
                    <div className="h-10 skeleton rounded-lg w-1/6" />
                    <div className="h-10 skeleton rounded-lg w-1/6" />
                    <div className="h-10 skeleton rounded-lg w-1/5" />
                </div>
            ))}
        </div>
    );
};

const CustomerTable = ({ className, isLoading, setIsLoading, search, searchSubscriptionEndDate }) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            try {
                setIsLoading(true);
                const response = await handleApi(
                    `/customers/get?search=${search}&searchSubscriptionEndDate=${searchSubscriptionEndDate}&page=${currentPage}&limit=${pageSize}&sortBy=${sortConfig.key}&sortDirection=${sortConfig.direction}`,
                    "GET",
                    {},
                    navigate
                );
                if (response?.success && isMounted) {
                    setCustomers(response.customers);
                    setTotalItems(response.total);
                    setTotalPages(Math.ceil(response.total / pageSize));
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        getData();

        return () => {
            isMounted = false;
        };
    }, [search, searchSubscriptionEndDate, currentPage, pageSize, sortConfig, setIsLoading, navigate]);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteCustomer, setDeleteCustomer] = useState(null);

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleCustomerUpdate = (updatedCustomer) => {
        setCustomers(prevCustomers =>
            prevCustomers.map(customer =>
                customer?._id === updatedCustomer?._id ? updatedCustomer : customer
            )
        );
        setSelectedCustomer(updatedCustomer);
    };

    const handleDelete = async (_id) => {
        try {
            const response = await handleApi(`/customers/delete/${_id}`, 'DELETE');
            if (response?.success) {
                setCustomers(prev => prev.filter(c => c._id !== _id));
                toast.success('Customer deleted successfully');
            } else {
                toast.error('Failed to delete customer');
            }
        } catch (err) {
            toast.error('Error deleting customer');
        } finally {
            setDeleteCustomer(null);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
        setCurrentPage(1);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const generateFileName = (extension) => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        let filename = `customers-${dateStr}`;

        if (search) filename += `-search-${search.replace(/[^a-zA-Z0-9]/g, '')}`;
        if (searchSubscriptionEndDate) filename += `-sub-${searchSubscriptionEndDate}`;
        filename += `-page-${currentPage}.${extension}`;

        return filename;
    };

    const handleExportCSV = () => {
        if (customers.length === 0) {
            toast.warning('No data to export');
            return;
        }

        setIsExporting(true);

        try {
            const headers = [
                'Customer Name', 'Email', 'Order From', 'Contact ID', 'Order Date',
                'Subscription End', 'GPT Account', 'Payment Status', 'Paid Amount',
                'Payment Method', 'Payment Date', 'Notes', 'Reminder Date', 'Reminder Notes'
            ];

            const csvData = customers.map(customer => [
                customer.customerName || '',
                customer.email || '',
                customer.orderFrom || '',
                customer.waOrFbId || '',
                formatDate(customer.orderDate) || '',
                formatDate(customer.subscriptionEnd) || '',
                customer.gptAccount || '',
                customer.paymentStatus || '',
                customer.paidAmount || '',
                customer.paymentMethod || '',
                customer.paymentDate ? formatDate(customer.paymentDate) : '',
                customer.note || '',
                customer.reminderDate ? formatDate(customer.reminderDate) : '',
                customer.reminderNote || ''
            ]);

            const csvContent = [
                headers.join(','),
                ...csvData.map(row =>
                    row.map(field => {
                        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
                            return `"${field.replace(/"/g, '""')}"`;
                        }
                        return field;
                    }).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', generateFileName('csv'));
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success(`Exported ${customers.length} customers to CSV successfully`);
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
            toast.error('Failed to export CSV');
        } finally {
            setIsExporting(false);
            setShowExportDropdown(false);
        }
    };

    const handleExportPDF = () => {
        if (customers.length === 0) {
            toast.warning('No data to export');
            return;
        }

        setIsExporting(true);

        try {
            const doc = new jsPDF('l', 'mm', 'a4');

            doc.setFontSize(20);
            doc.setTextColor(40, 40, 40);
            doc.text('Customer Report', 20, 20);

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            const now = new Date();
            let subtitle = `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
            let currentY = 30;

            doc.text(subtitle, 20, currentY);
            currentY += 6;

            if (search || searchSubscriptionEndDate) {
                let filterText = 'Filters: ';
                if (search) filterText += `Search: "${search}"`;
                if (search && searchSubscriptionEndDate) filterText += ', ';
                if (searchSubscriptionEndDate) filterText += `Subscription End: ${searchSubscriptionEndDate}`;
                doc.text(filterText, 20, currentY);
                currentY += 8;
            } else {
                currentY += 2;
            }

            const startY = currentY + 5;
            const tableWidth = 257;
            const rowHeight = 8;
            const headerHeight = 10;

            const columns = [
                { title: 'Customer Name', width: 45 },
                { title: 'Email', width: 50 },
                { title: 'Order From', width: 25 },
                { title: 'Subscription End', width: 30 },
                { title: 'GPT Account', width: 35 },
                { title: 'Payment Status', width: 25 },
                { title: 'Paid Amount', width: 25 }
            ];

            let currentX = 20;
            let currentTableY = startY;

            doc.setFillColor(139, 92, 246);
            doc.rect(20, currentTableY, tableWidth, headerHeight, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');

            currentX = 20;
            columns.forEach(col => {
                doc.text(col.title, currentX + 2, currentTableY + 7);
                currentX += col.width;
            });

            currentTableY += headerHeight;

            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);

            customers.forEach((customer, index) => {
                if (index % 2 === 1) {
                    doc.setFillColor(30, 30, 42);
                    doc.rect(20, currentTableY, tableWidth, rowHeight, 'F');
                }

                doc.setTextColor(40, 40, 40);

                const rowData = [
                    customer.customerName || '',
                    customer.email || '',
                    customer.orderFrom || '',
                    formatDate(customer.subscriptionEnd) || '',
                    customer.gptAccount || 'Not assigned',
                    customer.paymentStatus || '',
                    customer.paidAmount ? `$${customer.paidAmount}` : ''
                ];

                currentX = 20;
                columns.forEach((col, colIndex) => {
                    let text = rowData[colIndex];
                    if (text.length > 20) {
                        text = text.substring(0, 17) + '...';
                    }
                    doc.text(text, currentX + 2, currentTableY + 6);
                    currentX += col.width;
                });

                currentTableY += rowHeight;

                if (currentTableY > 180) {
                    doc.addPage();
                    currentTableY = 20;

                    doc.setFillColor(139, 92, 246);
                    doc.rect(20, currentTableY, tableWidth, headerHeight, 'F');

                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(9);
                    doc.setFont(undefined, 'bold');

                    currentX = 20;
                    columns.forEach(col => {
                        doc.text(col.title, currentX + 2, currentTableY + 7);
                        currentX += col.width;
                    });

                    currentTableY += headerHeight;
                    doc.setFont(undefined, 'normal');
                    doc.setFontSize(8);
                }
            });

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);

            currentX = 20;
            columns.forEach((col, index) => {
                if (index < columns.length - 1) {
                    currentX += col.width;
                    doc.line(currentX, startY, currentX, Math.min(currentTableY, 180));
                }
            });

            doc.rect(20, startY, tableWidth, Math.min(currentTableY - startY, 180 - startY));

            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(
                    `Page ${i} of ${pageCount} | Total Customers: ${customers.length}`,
                    20,
                    doc.internal.pageSize.height - 10
                );
            }

            doc.save(generateFileName('pdf'));

            toast.success(`Exported ${customers.length} customers to PDF successfully`);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
            setShowExportDropdown(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`w-full ${className}`}>
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Table Controls */}
            <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b"
                style={{ borderColor: 'var(--border-subtle)' }}
            >
                <div className="flex items-center gap-4">
                    <PageSizeSelector
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                    />
                    <div
                        className="text-sm px-4 py-2 rounded-xl font-medium"
                        style={{
                            background: 'var(--bg-surface)',
                            color: 'var(--text-tertiary)',
                        }}
                    >
                        Showing {customers.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                    </div>
                </div>

                {/* Export Actions */}
                <div className="flex items-center gap-3 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowExportDropdown(!showExportDropdown)}
                            disabled={isExporting || customers.length === 0}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${isExporting || customers.length === 0
                                ? 'bg-[var(--bg-surface)] text-[var(--text-muted)] cursor-not-allowed'
                                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
                                }`}
                            style={{ border: '1px solid var(--border-subtle)' }}
                            title={customers.length === 0 ? 'No data to export' : 'Export current page data'}
                        >
                            {isExporting ? (
                                <>
                                    <svg className="w-4 h-4 animate-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export ({customers.length})
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </>
                            )}
                        </button>

                        {/* Export Dropdown */}
                        {showExportDropdown && !isExporting && customers.length > 0 && (
                            <div
                                className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in-down"
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-subtle)',
                                }}
                            >
                                <div className="py-2">
                                    <button
                                        onClick={handleExportCSV}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-all duration-200 hover:bg-[var(--bg-hover)]"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <div
                                            className="p-1.5 rounded-lg"
                                            style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                                        >
                                            <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-[var(--text-primary)]">Export as CSV</div>
                                            <div className="text-xs text-[var(--text-muted)]">Spreadsheet format</div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-all duration-200 hover:bg-[var(--bg-hover)]"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        <div
                                            className="p-1.5 rounded-lg"
                                            style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                                        >
                                            <svg className="w-4 h-4 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-[var(--text-primary)]">Export as PDF</div>
                                            <div className="text-xs text-[var(--text-muted)]">Document format</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                {customers.length === 0 ? (
                    <div className="text-center py-16">
                        <div
                            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                            style={{ background: 'var(--bg-surface)' }}
                        >
                            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No customers found</h3>
                        <p className="text-[var(--text-tertiary)]">
                            {search || searchSubscriptionEndDate
                                ? "Try adjusting your search criteria"
                                : "Get started by adding your first customer"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <TableHeader
                                sortConfig={sortConfig}
                                onSort={handleSort}
                            />
                            <tbody>
                                {customers?.map((item, index) => (
                                    <TableRow
                                        key={item._id}
                                        item={item}
                                        index={index}
                                        formatDate={formatDate}
                                        onViewDetails={handleViewDetails}
                                        onDelete={setDeleteCustomer}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Close dropdown when clicking outside */}
            {showExportDropdown && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowExportDropdown(false)}
                />
            )}

            {/* Pagination */}
            {customers.length > 0 && (
                <div
                    className="p-6 border-t"
                    style={{ borderColor: 'var(--border-subtle)' }}
                >
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {selectedCustomer && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    formatDate={formatDate}
                    onUpdate={handleCustomerUpdate}
                />
            )}
            {deleteCustomer && (
                <DeleteCustomerModal
                    customer={deleteCustomer}
                    onClose={() => setDeleteCustomer(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default CustomerTable;