import React, { useEffect, useState, useCallback } from 'react';
import handleApi from '../../libs/handleAPi';
import { useNavigate } from 'react-router-dom';

// Import all components
import PageHeader from './components/PageHeader';
import SearchSection from './components/SearchSection';
import ResultsSummary from './components/ResultsSummary';
import MemberCard from './components/MemberCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import EmptyState from './components/EmptyState';
import Pagination from './components/Pagination';

const RemovedMembers = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchEmail, setSearchEmail] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const itemsPerPage = 10; // Backend pagination limit

    const fetchMembers = useCallback(async (email = '', page = 1) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (email) queryParams.append('email', email);
            queryParams.append('page', page.toString());
            
            const response = await handleApi(`/customers/removed-members?${queryParams.toString()}`, 'GET', null, navigate);
            
            if (response.success) {
                setMembers(response.data);
                
                // Calculate total pages based on returned data
                // If we get exactly itemsPerPage items, there might be more pages
                if (response.data.length === itemsPerPage) {
                    // There might be more pages, so we show at least current + 1
                    setTotalPages(Math.max(page + 1, totalPages));
                } else {
                    // This is the last page
                    setTotalPages(page);
                }
                
                // Update total count (this would ideally come from backend)
                setTotalCount(response.totalCount || response.data.length);
            }
        } catch (error) {
            console.error('Error fetching removed members:', error);
            setMembers([]);
            setTotalPages(1);
            setTotalCount(0);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    }, [navigate, itemsPerPage]);

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleSearch = useCallback((email) => {
        setIsSearching(true);
        setCurrentPage(1);
        setTotalPages(1); // Reset pagination
        fetchMembers(email, 1);
    }, [fetchMembers]);

    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchMembers(searchEmail, page);
        }
    };

    const clearSearch = () => {
        setSearchEmail('');
        setCurrentPage(1);
        setTotalPages(1);
        handleSearch('');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader />
            
            <SearchSection
                searchEmail={searchEmail}
                setSearchEmail={setSearchEmail}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                isSearching={isSearching}
                currentPage={currentPage}
                totalPages={totalPages}
            />

            <ResultsSummary
                searchEmail={searchEmail}
                membersCount={members.length}
                loading={loading}
            />

            <div className="space-y-6">
                {loading ? (
                    <LoadingSkeleton />
                ) : members.length === 0 ? (
                    <EmptyState
                        searchEmail={searchEmail}
                        clearSearch={clearSearch}
                    />
                ) : (
                    <>
                        <div className="space-y-4">
                            {members.map((member) => (
                                <MemberCard key={member._id} member={member} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default RemovedMembers;