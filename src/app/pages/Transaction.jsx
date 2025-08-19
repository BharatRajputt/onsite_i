"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, Calendar, Download, Plus, TrendingUp, Receipt, Wallet, DollarSign, X, ChevronDown, TrendingDown, FileText, ArrowRightLeft } from 'lucide-react';
import Table from '../component/table/Table';
import DynamicModal from '../component/DynamicModal';
import { 
  openModal, 
  closeModal, 
  selectOption, 
  goBackToOptions 
} from '../store/transactionOptionSlice.js';
import { FORM_TYPES } from '../config/formConfig';
import TransactionOptionSelector from '../modals/TrasactionOptionSelector';

// Icon mapping for transaction options
const iconMap = {
  TrendingUp,
  TrendingDown,
  FileText,
  Receipt,
  ArrowRightLeft
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  amount, 
  subtitle, 
  icon: Icon, 
  bgColor = "bg-blue-50", 
  iconColor = "text-blue-600",
  borderColor = "border-blue-100"
}) => {
  return (
    <div className={`${bgColor} ${borderColor} border rounded-2xl p-6 relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs text-white">?</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">₹ {amount}</div>
          <div className="text-sm text-gray-600">{subtitle}</div>
        </div>
        <div className={`w-16 h-16 ${iconColor} opacity-20`}>
          <Icon size={64} />
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20"></div>
    </div>
  );
};

// Badge Component
const Badge = ({ children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Transaction Option Selector Component
  // const TransactionOptionSelector = () => {
  //   const dispatch = useDispatch();
  //   const { options, isModalOpen, step } = useSelector(state => state.transactionOptions);

  //   const handleSelectOption = (optionId) => {
  //     dispatch(selectOption(optionId));
  //   };

  //   const handleClose = () => {
  //     dispatch(closeModal());
  //   };

  //   if (step !== 'option-selector') return null;

  //   return (
  //     <>
  //       <style jsx>{`
  //         @keyframes slideInRight {
  //           0% { transform: translateX(100%); opacity: 0; }
  //           100% { transform: translateX(0); opacity: 1; }
  //         }
  //         .slide-in-right { animation: slideInRight 0.3s ease-out; }
  //         .backdrop-fade-in { animation: fadeIn 0.3s ease-out; }
  //         @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
  //       `}</style>

  //       <div className="fixed inset-0 z-50 flex justify-end">
  //         <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-fade-in" onClick={handleClose}></div>
          
  //         <div className="relative bg-white w-full max-w-md h-full overflow-y-auto slide-in-right shadow-2xl">
  //           <div className="flex items-center justify-between p-4 border-b">
  //             <h2 className="text-lg font-semibold text-gray-900">Create Transaction</h2>
  //             <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 p-1">
  //               <X size={20} />
  //             </button>
  //           </div>

  //           <div className="p-4 space-y-3">
  //             <p className="text-sm text-gray-600 mb-6">Select transaction type:</p>
              
  //             {options.map((option) => {
  //               const IconComponent = iconMap[option.icon] || Plus;
  //               return (
  //                 <button
  //                   key={option.id}
  //                   onClick={() => handleSelectOption(option.id)}
  //                   className={`w-full p-4 rounded-lg border-2 bg-${option.color}-50 border-${option.color}-200 hover:border-opacity-80 transition-all duration-200 hover:shadow-md`}
  //                 >
  //                   <div className="flex items-center space-x-4">
  //                     <div className={`p-3 rounded-full bg-${option.color}-100`}>
  //                       <IconComponent size={24} className={`text-${option.color}-600`} />
  //                     </div>
  //                     <div className="text-left flex-1">
  //                       <h3 className="font-semibold text-gray-900">{option.name}</h3>
  //                       <p className="text-sm text-gray-600">{option.description}</p>
  //                     </div>
  //                     <ChevronDown size={16} className="text-gray-400 transform rotate-[-90deg]" />
  //                   </div>
  //                 </button>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

const Transaction = () => {
  const dispatch = useDispatch();
  const {selectedOption,  isModalOpen, step } = useSelector(state => state.transactionOptions);
  const { transactions } = useSelector(state => state.transactionFields);

  // Calculate statistics from Redux transactions
  const calculateStats = () => {
    if (!transactions || transactions.length === 0) {
      return {
        totalInvoice: 0,
        totalExpense: 0,
        margin: 0
      };
    }

    const income = transactions
      .filter(t => ['PAYMENT_IN', 'SALES_INVOICE'].includes(t.type))
      .reduce((sum, t) => sum + parseFloat(t.formData.amount || 0), 0);

    const expense = transactions
      .filter(t => ['PAYMENT_OUT', 'MATERIAL_PURCHASE', 'OTHER_EXPENSE'].includes(t.type))
      .reduce((sum, t) => sum + parseFloat(t.formData.amount || 0), 0);

    return {
      totalInvoice: income,
      totalExpense: expense,
      margin: income - expense
    };
  };

  const stats = calculateStats();

  const handleCreateTransaction = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // Map option ID to form type
  const getFormType = (optionId) => {
    console.log(optionId,"optinndddddd")
    switch (optionId) {
      case 'PAYMENT_IN': return FORM_TYPES.PAYMENT_IN;
      case 'PAYMENT_OUT': return FORM_TYPES.PAYMENT_OUT;
      case 'DEBIT_NOTE': return FORM_TYPES.DEBIT_NOTE;
      case 'CREDIT_NOTE': return FORM_TYPES.CREDIT_NOTE;
      case 'PARTY_TO_PARTY': return FORM_TYPES.PARTY_TO_PARTY;
      case 'SALES_INVOICE': return FORM_TYPES.SALES_INVOICE;
      default: return FORM_TYPES.PAYMENT_IN;
    }
  };

  // Format transactions for table display
  const tableTransactions = transactions.map(transaction => ({
    id: transaction.id,
    party: transaction.formData.partyName || 
           transaction.formData.paymentFrom || 
           transaction.formData.client || 
           'N/A',
    details: transaction.formData.description || 
             transaction.type.replace('_', ' ') || 
             'Transaction',
    amount: parseFloat(transaction.formData.amount || 0),
    type: ['PAYMENT_IN', 'SALES_INVOICE'].includes(transaction.type) ? 'income' : 'expense',
    status: 'completed',
    date: transaction.formData.date || transaction.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    transactionType: transaction.type
  }));

  const columns = [
    {
      key: "party",
      label: "Party",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
            {row.party.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.party}</div>
            <div className="text-sm text-gray-500">ID: #{row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "details",
      label: "Details",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.details}</div>
          <div className="text-sm text-gray-500">{row.date}</div>
          <div className="text-xs text-purple-600 mt-1">
            {row.transactionType?.replace('_', ' ')}
          </div>
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <div className="text-right">
          <div className={`font-bold text-lg ${row.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {row.type === 'income' ? '+' : '-'}₹ {row.amount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 capitalize">{row.type}</div>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="text-right">
          <Badge variant={row.status === 'completed' ? 'success' : 'warning'}>
            {row.status}
          </Badge>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900"></h1>
            <p className="text-gray-600 mt-1"></p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Calendar size={16} />
              <span>Date Filter</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Badge variant="success" className="relative">
                Unbilled Materials
                <span className="absolute -top-1 -right-1 w-2 h-2rounded-full"></span>
              </Badge>
              <span className="text-gray-400">0</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="" className="relative">
                Pending Entries
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </Badge>
              <span className="text-gray-400">0</span>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Download size={16} />
              <span>Download</span>
            </button>
            
            <button 
              onClick={handleCreateTransaction}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus size={16} />
              <span>Create Transaction</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Invoice"
            amount={stats.totalInvoice.toLocaleString()}
            subtitle={`Payment In ₹ ${stats.totalInvoice.toLocaleString()}`}
            icon={Receipt}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
            borderColor="border-blue-100"
          />
          
          <StatsCard
            title="Expense"
            amount={stats.totalExpense.toLocaleString()}
            subtitle={`Payment Out ₹ ${stats.totalExpense.toLocaleString()}`}
            icon={Wallet}
            bgColor="bg-red-50"
            iconColor="text-red-600"
            borderColor="border-red-100"
          />
          
          <StatsCard
            title="Margin"
            amount={stats.margin.toLocaleString()}
            subtitle={`Project Balance ₹ ${stats.margin.toLocaleString()}`}
            icon={DollarSign}
            bgColor={stats.margin >= 0 ? "bg-green-50" : "bg-red-50"}
            iconColor={stats.margin >= 0 ? "text-green-600" : "text-red-600"}
            borderColor={stats.margin >= 0 ? "border-green-100" : "border-red-100"}
          />
        </div>

        {/* Transactions Table */}
        <Table
          columns={columns}
          data={tableTransactions}
          visibleColumns={['party', 'details', 'amount', 'status']}
          emptyMessage="No transactions found"
        />

        {/* Empty State (when no transactions) */}
        {tableTransactions.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Transaction</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                No transactions found for this project. Start by creating your first transaction to track income and expenses.
              </p>
              <button 
                onClick={handleCreateTransaction}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
              >
                <Plus size={16} />
                <span>Create First Transaction</span>
              </button>
            </div>
          </div>
        )}

        {/* Transaction Options Modal */}
       {isModalOpen && step === 'option-selector' && (
  <TransactionOptionSelector
  iconMap={iconMap}
  selectOption={selectOption}
  onClose={onclose}
  />
)}

        {/* Dynamic Form Modal */}
        {isModalOpen && step === 'form' && selectedOption && (
          <DynamicModal
            isOpen={true}
            onClose={handleCloseModal}
            // formType={getFormType(selectedOption.id)}
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;