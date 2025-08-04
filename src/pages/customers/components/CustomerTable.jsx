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
        <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg mb-4" />
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex space-x-4 mb-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
            ))}
        </div>
    );
};

const CustomerTable = ({ className, isLoading, setIsLoading, search }) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            try {
                setIsLoading(true);
                const response = await handleApi(
                    `/customers/get?search=${search}&page=${currentPage}&limit=${pageSize}&sortBy=${sortConfig.key}&sortDirection=${sortConfig.direction}`,
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
    }, [search, currentPage, pageSize, sortConfig, setIsLoading, navigate]);

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
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when page size changes
    };

    if (isLoading) {
        return (
            <div className={`w-full ${className}`}>
                <div className="relative shadow-md sm:rounded-lg bg-white dark:bg-gray-900 mb-6 p-4">
                    <TableSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${className} overflow-auto`}>
            <div className="flex justify-between items-center mb-4">
                <PageSizeSelector 
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {customers.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                </div>
            </div>

            <div className="relative shadow-md sm:rounded-lg bg-white dark:bg-gray-900 mb-6">
                <div className="min-w-full">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <TableHeader 
                            sortConfig={sortConfig}
                            onSort={handleSort}
                        />
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {customers?.map((item) => (
                                <TableRow
                                    key={item._id}
                                    item={item}
                                    formatDate={formatDate}
                                    onViewDetails={handleViewDetails}
                                    onDelete={setDeleteCustomer}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

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