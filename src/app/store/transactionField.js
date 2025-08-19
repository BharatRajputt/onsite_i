
import { createSlice } from '@reduxjs/toolkit';

const transactionFieldsSlice = createSlice({
  name: 'transactionFields',
  initialState: {
    // Field configurations for each transaction type
    fieldConfigs: {
      PAYMENT_IN: {
        title: 'Payment In',
        subtitle: 'PAYMENT',
        headerColor: 'purple',
        fields: [
          {
            name: 'partyName',
            label: 'PARTY NAME',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Party name is required' }
          },
          {
            name: 'amount',
            label: 'AMOUNT',
            type: 'number',
            placeholder: '',
            required: true,
            validation: { required: 'Amount is required' }
          },
          {
            name: 'paymentMethod',
            label: 'Payment Method',
            type: 'radio',
            options: ['Cash', 'Bank Transfer', 'Cheque'],
            required: true,
            validation: { required: 'Payment method is required' }
          },
          {
            name: 'costCode',
            label: 'ADD COST CODE',
            type: 'dropdown',
            placeholder: 'Select Cost Code',
            options: ['CC001', 'CC002', 'CC003', 'CC004']
          },
          {
            name: 'moreDetails',
            label: 'More Details (Optional)',
            type: 'collapsible',
            collapsible: true
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          partyName: '',
          amount: '',
          paymentMethod: '',
          costCode: '',
          moreDetails: '',
          uploadFiles: []
        }
      },

      PAYMENT_OUT: {
        title: 'Payment Out',
        subtitle: 'PAYMENT',
        headerColor: 'purple',
        fields: [
          {
            name: 'partyName',
            label: 'PARTY NAME',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Party name is required' }
          },
          {
            name: 'amount',
            label: 'AMOUNT',
            type: 'number',
            placeholder: '',
            required: true,
            validation: { required: 'Amount is required' }
          },
          {
            name: 'paymentMethod',
            label: 'Payment Method',
            type: 'radio',
            options: ['Cash', 'Bank Transfer', 'Cheque'],
            required: true,
            validation: { required: 'Payment method is required' }
          },
          {
            name: 'costCode',
            label: 'ADD COST CODE',
            type: 'dropdown',
            placeholder: 'Select Cost Code',
            options: ['CC001', 'CC002', 'CC003', 'CC004']
          },
          {
            name: 'moreDetails',
            label: 'More Details (Optional)',
            type: 'collapsible',
            collapsible: true
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          partyName: '',
          amount: '',
          paymentMethod: '',
          costCode: '',
          moreDetails: '',
          uploadFiles: []
        }
      },

      DEBIT_NOTE: {
        title: 'Debit Note',
        subtitle: 'DEBIT NOTE',
        headerColor: 'purple',
        fields: [
          {
            name: 'partyName',
            label: 'PARTY NAME',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Party name is required' }
          },
          {
            name: 'newItem',
            label: '+ New Item',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'totalAmount',
            label: 'Total Amount',
            type: 'display_amount'
          },
          {
            name: 'amount',
            label: 'AMOUNT',
            type: 'number',
            placeholder: '',
            required: true,
            validation: { required: 'Amount is required' }
          },
          {
            name: 'referenceNo',
            label: '+ Reference No',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'notes',
            label: '+ Notes',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          partyName: '',
          items: [],
          totalAmount: 0,
          amount: '',
          referenceNo: '',
          notes: '',
          uploadFiles: []
        }
      },

      CREDIT_NOTE: {
        title: 'Credit Note',
        subtitle: 'CREDIT NOTE',
        headerColor: 'purple',
        fields: [
          {
            name: 'partyName',
            label: 'PARTY NAME',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Party name is required' }
          },
          {
            name: 'newItem',
            label: '+ New Item',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'totalAmount',
            label: 'Total Amount',
            type: 'display_amount'
          },
          {
            name: 'amount',
            label: 'AMOUNT',
            type: 'number',
            placeholder: '',
            required: true,
            validation: { required: 'Amount is required' }
          },
          {
            name: 'referenceNo',
            label: '+ Reference No',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'notes',
            label: '+ Notes',
            type: 'button',
            buttonType: 'add'
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          partyName: '',
          items: [],
          totalAmount: 0,
          amount: '',
          referenceNo: '',
          notes: '',
          uploadFiles: []
        }
      },

      PARTY_TO_PARTY: {
        title: 'Party to Party',
        subtitle: 'PAYMENT',
        headerColor: 'purple',
        fields: [
          {
            name: 'paymentFrom',
            label: 'PAYMENT FROM',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Payment from is required' }
          },
          {
            name: 'paymentTo',
            label: 'PAYMENT TO',
            type: 'search',
            placeholder: '',
            required: true,
            validation: { required: 'Payment to is required' }
          },
          {
            name: 'amount',
            label: 'AMOUNT',
            type: 'number',
            placeholder: '',
            required: true,
            validation: { required: 'Amount is required' }
          },
          {
            name: 'description',
            label: 'DESCRIPTION',
            type: 'textarea',
            placeholder: '',
            rows: 4,
            required: true,
            validation: { required: 'Description is required' }
          },
          {
            name: 'costCode',
            label: 'ADD COST CODE',
            type: 'dropdown',
            placeholder: 'Select Cost Code',
            options: ['CC001', 'CC002', 'CC003', 'CC004']
          },
          {
            name: 'moreDetails',
            label: 'More Details (Optional)',
            type: 'collapsible',
            collapsible: true
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          paymentFrom: '',
          paymentTo: '',
          amount: '',
          description: '',
          costCode: '',
          moreDetails: '',
          uploadFiles: []
        }
      },

      SALES_INVOICE: {
        title: 'Sales Invoice',
        subtitle: 'SALES INVOICE',
        headerColor: 'purple',
        fields: [
          {
            name: 'itemLevelTax',
            label: 'Item Level Tax',
            type: 'toggle',
            defaultValue: false
          },
          {
            name: 'client',
            label: 'Client',
            type: 'display',
            value: 'Dhruv',
            bold: true
          },
          {
            name: 'date',
            label: 'Date',
            type: 'display',
            value: '17 Aug, 2025'
          },
          {
            name: 'invoiceNo',
            label: 'Invoice No',
            type: 'display',
            value: 'INV- 1',
            bold: true
          },
          {
            name: 'boqItems',
            label: 'Select BOQ Items(0)',
            type: 'button',
            buttonType: 'add',
            buttonText: '+ Add Item'
          },
          {
            name: 'itemSubtotal',
            label: 'Item Subtotal',
            type: 'display_amount',
            value: 0
          },
          {
            name: 'netSubtotal',
            label: 'Net Subtotal',
            type: 'display_amount',
            value: 0
          },
          {
            name: 'tax',
            label: 'Tax',
            type: 'tax_buttons',
            options: ['18%', '12%', '5%', '0%', '9%', '28%', '0.1%', '0.25%', '1.5%', '3%', '6%', '7.5%', '14%'],
            defaultValue: '18%'
          },
          {
            name: 'totalAmount',
            label: 'Total Amount',
            type: 'display_amount',
            value: 0
          },
          {
            name: 'netAmount',
            label: 'Net Amount',
            type: 'display_amount',
            value: 0
          },
          {
            name: 'roundOff',
            label: 'Round Off',
            type: 'number',
            placeholder: '0.00',
            step: '0.01'
          },
          {
            name: 'billToShipTo',
            label: 'Bill To/Ship To',
            type: 'button',
            buttonType: 'add',
            buttonText: '+ Add'
          },
          {
            name: 'uploadFiles',
            label: 'Upload Files',
            type: 'file',
            multiple: true
          }
        ],
        defaultValues: {
          itemLevelTax: false,
          client: 'Dhruv',
          date: '17 Aug, 2025',
          invoiceNo: 'INV- 1',
          boqItems: [],
          itemSubtotal: 0,
          netSubtotal: 0,
          tax: '18%',
          totalAmount: 0,
          netAmount: 0,
          roundOff: 0,
          billToShipTo: '',
          uploadFiles: []
        }
      }
    },

    // Current form data
    currentFormData: {},
    
    // Current transaction being created/edited
    currentTransaction: {
      id: null,
      type: '',
      createdAt: null,
      formData: {}
    },

    // All saved transactions
    transactions: [],
    
    // Form validation errors
    formErrors: {},
    
    // Loading states
    isLoading: false,
    isSaving: false
  },

  reducers: {
    // Initialize form for selected option
    initializeForm: (state, action) => {
      const optionId = action.payload;
      const config = state.fieldConfigs[optionId];
      
      if (config) {
        state.currentFormData = { ...config.defaultValues };
        state.currentTransaction = {
          id: null,
          type: optionId,
          createdAt: null,
          formData: { ...config.defaultValues }
        };
        state.formErrors = {};
      }
    },

    // Update form field
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.currentFormData[field] = value;
      state.currentTransaction.formData[field] = value;
      
      // Clear error for this field
      if (state.formErrors[field]) {
        delete state.formErrors[field];
      }
    },

    // Update entire form data
    updateFormData: (state, action) => {
      state.currentFormData = { ...state.currentFormData, ...action.payload };
      state.currentTransaction.formData = { ...state.currentTransaction.formData, ...action.payload };
    },

    // Set form errors
    setFormErrors: (state, action) => {
      state.formErrors = action.payload;
    },

    // Clear form errors
    clearFormErrors: (state) => {
      state.formErrors = {};
    },

    // Save transaction
    saveTransaction: (state, action) => {
      const transactionData = action.payload || state.currentTransaction;
      
      const newTransaction = {
        ...transactionData,
        id: transactionData.id || Date.now(),
        createdAt: transactionData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // If editing, update existing transaction
      const existingIndex = state.transactions.findIndex(t => t.id === newTransaction.id);
      if (existingIndex !== -1) {
        state.transactions[existingIndex] = newTransaction;
      } else {
        // Add new transaction
        state.transactions.unshift(newTransaction);
      }

      // Clear current form
      state.currentFormData = {};
      state.currentTransaction = {
        id: null,
        type: '',
        createdAt: null,
        formData: {}
      };
      state.formErrors = {};
    },

    // Delete transaction
    deleteTransaction: (state, action) => {
      const transactionId = action.payload;
      state.transactions = state.transactions.filter(t => t.id !== transactionId);
    },

    // Load transaction for editing
    loadTransactionForEdit: (state, action) => {
      const transactionId = action.payload;
      const transaction = state.transactions.find(t => t.id === transactionId);
      
      if (transaction) {
        state.currentTransaction = { ...transaction };
        state.currentFormData = { ...transaction.formData };
        state.formErrors = {};
      }
    },

    // Clear current form
    clearCurrentForm: (state) => {
      state.currentFormData = {};
      state.currentTransaction = {
        id: null,
        type: '',
        createdAt: null,
        formData: {}
      };
      state.formErrors = {};
    },

    // Set loading states
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },

    // Add new field config
    addFieldConfig: (state, action) => {
      const { optionId, fieldConfig } = action.payload;
      if (state.fieldConfigs[optionId]) {
        state.fieldConfigs[optionId] = fieldConfig;
      }
    },

    // Update field in config
    updateFieldInConfig: (state, action) => {
      const { optionId, fieldIndex, fieldData } = action.payload;
      if (state.fieldConfigs[optionId] && state.fieldConfigs[optionId].fields[fieldIndex]) {
        state.fieldConfigs[optionId].fields[fieldIndex] = {
          ...state.fieldConfigs[optionId].fields[fieldIndex],
          ...fieldData
        };
      }
    }
  }
});

export const {
  initializeForm,
  updateFormField,
  updateFormData,
  setFormErrors,
  clearFormErrors,
  saveTransaction,
  deleteTransaction,
  loadTransactionForEdit,
  clearCurrentForm,
  setLoading,
  setSaving,
  addFieldConfig,
  updateFieldInConfig
} = transactionFieldsSlice.actions;

export default transactionFieldsSlice.reducer;
