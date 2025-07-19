import React, { useEffect } from 'react';
import { FaEye, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import handleApi from '../../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';
import CustomerDetailsModal from './CustomerDetailsModal';
import DeleteCustomerModal from './DeleteCustomerModal';
import { toast } from 'react-toastify';

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
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const getData = async () => {
            console.log("test")
            try {
                setIsLoading(true);
                const response = await handleApi(`/customers/get?search=${search}`, "GET", {}, navigate);
                if (response?.success && isMounted) {
                    console.log(response)
                    setCustomers(response.customers);
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

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [search, setIsLoading, navigate]);

    

    const [activeNote, setActiveNote] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteCustomer, setDeleteCustomer] = useState(null);

    const handleViewDetails = (customer) => {
        console.log(customer)
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
            <div className="relative shadow-md sm:rounded-lg bg-white dark:bg-gray-900 mb-6">
                <div className="min-w-full">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                {[
                                    { label: 'Customer Name', showOnMobile: true },
                                    { label: 'Order From', showOnMobile: true },
                                    { label: 'WA/FB ID', showOnMobile: true },
                                    { label: 'Email', showOnMobile: false },
                                    { label: 'Subscription End', showOnMobile: false },
                                    { label: 'GPT Account', showOnMobile: false },
                                    { label: 'Order Date', showOnMobile: false },
                                    { label: 'Note', showOnMobile: false },
                                    { label: 'Payment Status', showOnMobile: false },
                                    { label: 'Actions', showOnMobile: true }
                                ].map((header) => (
                                    <th
                                        key={header.label}
                                        scope="col"
                                        className={`px-4 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${!header.showOnMobile ? 'hidden md:table-cell' : ''}`}
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {customers?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.customerName}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                            {item.orderFrom}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {item.waOrFbId}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                            {item.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {formatDate(item.subscriptionEnd)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {item.gptAccount}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            {formatDate(item.orderDate)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <button
                                            onClick={() => setActiveNote(activeNote === `note-${index}` ? null : `note-${index}`)}
                                            className="group relative inline-flex items-center justify-center"
                                        >
                                            <FaEye className="h-5 w-5 text-blue-600 hover:text-blue-700 transition-colors" />
                                            <div className={`
                                                absolute z-10 w-48 p-2 mt-2 text-sm text-left text-white bg-gray-800 
                                                rounded-lg shadow-lg -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full
                                                transition-opacity duration-300
                                                ${activeNote === `note-${index}` ? 'opacity-100 visible' : 'opacity-0 invisible'}
                                            `}>
                                                {item.note}
                                            </div>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap hidden md:table-cell">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.paymentStatus === 'paid' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                        }`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <button
                                            onClick={() => handleViewDetails(item)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => setDeleteCustomer(item)}
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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