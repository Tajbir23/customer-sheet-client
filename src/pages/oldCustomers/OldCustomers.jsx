import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import handleApi from '../../libs/handleAPi';
import { toast } from 'react-toastify';
import OldCustomersHeader from './components/OldCustomersHeader';
import DateFilter from './components/DateFilter';
import ActionToolbar from './components/ActionToolbar';
import OldCustomerTable from './components/OldCustomerTable';

const OldCustomers = () => {
  // State for dates and data
  const [firstSelect, setFirstSelect] = useState('');
  const [secondSelect, setSecondSelect] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    whatsapp: true,
    email: true,
    customerName: true,
    gptAccount: true,
    subscriptionEnd: true,
    paymentStatus: false,
    paymentMethod: false,
    note: false
  });
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  // Row expansion state
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Fetch data
  const fetchData = useCallback(async () => {
    console.log('fetchData called. firstSelect:', firstSelect, 'secondSelect:', secondSelect);

    try {
      setIsLoading(true);
      console.log('Fetching from API...');

      // Construct query string only if values exist
      let queryParams = '';
      if (firstSelect && secondSelect) {
        queryParams = `?firstSelect=${firstSelect}&secondSelect=${secondSelect}`;
      }

      const response = await handleApi(
        `/customers/get-customers-who-didnot-renew${queryParams}`,
        'GET'
      );

      console.log('API Response:', response);
      if (response.success && response.customers) {
        setData(response.customers);
        // Reset selection when data refreshes
        setSelectedIds(new Set());
      } else {
        toast.error(response.message || 'Failed to fetch customers');
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching old customers:', error);
      toast.error('An error occurred while fetching customers');
    } finally {
      setIsLoading(false);
    }
  }, [firstSelect, secondSelect]);

  // Fetch on date change
  useEffect(() => {
    console.log('useEffect triggered. firstSelect:', firstSelect, 'secondSelect:', secondSelect);
    fetchData();
  }, [fetchData]);

  // Filter data based on search
  const filteredData = useMemo(() => data.filter(customer => {
    const searchTerm = search.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm) ||
      customer.waOrFbId?.toLowerCase().includes(searchTerm) ||
      customer.gptAccount?.toLowerCase().includes(searchTerm)
    );
  }), [data, search]);

  // Handle Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredData.map(c => c._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Handle Column Toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle Row Expansion
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Handle Send Action
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const selectedCustomers = data.filter(c => selectedIds.has(c._id));
    const payload = selectedCustomers.map(c => ({
      email: c.email,
      waOrFbId: c.waOrFbId
    }));

    try {
      setIsSending(true);
      const response = await handleApi(
        '/whatsapp/send-message-to-select-sub-end-customers',
        'POST',
        payload
      );

      if (response.success) {
        toast.success(`Messages sent to ${payload.length} customers successfully!`);
        setSelectedIds(new Set()); // Clear selection after successful send
      } else {
        toast.error(response.message || 'Failed to send messages');
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      toast.error('An error occurred while sending messages');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Old Customers - Customer Sheet</title>
      </Helmet>

      <OldCustomersHeader />

      <div
        className="rounded-2xl p-6 mb-8 animate-fade-in-up"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '100ms',
        }}
      >
        <div className="flex flex-col gap-6">
          <DateFilter
            firstSelect={firstSelect}
            setFirstSelect={setFirstSelect}
            secondSelect={secondSelect}
            setSecondSelect={setSecondSelect}
          />

          <ActionToolbar
            search={search}
            setSearch={setSearch}
            showColumnToggle={showColumnToggle}
            setShowColumnToggle={setShowColumnToggle}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            selectedCount={selectedIds.size}
            handleSend={handleSend}
            isSending={isSending}
          />
        </div>
      </div>

      <OldCustomerTable
        isLoading={isLoading}
        data={filteredData}
        firstSelect={firstSelect}
        secondSelect={secondSelect}
        selectedIds={selectedIds}
        handleSelectAll={handleSelectAll}
        handleSelectRow={handleSelectRow}
        visibleColumns={visibleColumns}
        expandedRows={expandedRows}
        toggleRow={toggleRow}
      />
    </div>
  );
};

export default OldCustomers;