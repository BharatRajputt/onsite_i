export const FORM_TYPES = {
  PARTY: 'party',
  TODO: 'todo',
  TIMESHEET: 'timesheet',
  MOM: 'mom',
  LEAD:'lead'
};
  
export const formConfigs = {
  [FORM_TYPES.PARTY]: {
    title: 'ADD PARTY',
    fields: [
      {
        name: 'partyName',
        label: 'PARTY',
        type: 'text',
        placeholder: 'Party Name',
        required: true,
        validation: { required: 'Party name is required' }
      },
      {
        name: 'phone',
        label: 'PHONE',
        type: 'tel',
        placeholder: 'Phone',
        required: true,
        hasCountryCode: true,
        validation: { required: 'Phone number is required' }
      },
      {
        name: 'email',
        label: 'EMAIL',
        type: 'email',
        placeholder: 'Email',
        required: true,
        validation: { 
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' }
        }
      },
      {
        name: 'password',
        label: 'PASSWORD',
        type: 'password',
        placeholder: 'Enter password',
        required: true,
        validation: { 
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' }
        }
      },
      {
        name: 'partyType',
        label: 'PARTY TYPE',
        type: 'dropdown',
        options: [
          'Client', 'Staff', 'Worker', 'Investor', 'Vendor',
          'Labour Contractor', 'Material Supplier', 'Equipment Supplier',
          'Subcontractor', 'Other Vendor'
        ],
        defaultValue: 'Material Supplier'
      },
      {
        name: 'openingBalance',
        label: 'Opening Balance',
        type: 'number',
        placeholder: '0',
        prefix: '₹',
        defaultValue: 0
      },
      {
        name: 'bankAccount',
        label: 'Bank Account',
        type: 'text',
        placeholder: '--NA--'
      },
      {
        name: 'address',
        label: 'Your Address',
        type: 'textarea',
        placeholder: 'Enter address',
        rows: 2
      },
      {
        name: 'aadhaar',
        label: 'AADHAAR',
        type: 'text',
        placeholder: 'Aadhaar number',
        hasUploadButton: true
      },
      {
        name: 'pan',
        label: 'PAN',
        type: 'text',
        placeholder: 'PAN number',
        hasUploadButton: true
      }
    ],
    defaultValues: {
      partyName: '',
      phone: '',
      email: '',
      partyType: 'Material Supplier',
      openingBalance: 0,
      bankAccount: '',
      address: '',
      aadhaar: '',
      pan: '',
      password: ''
    }
  },
  
  [FORM_TYPES.TODO]: {
    title: 'NEW TO DO',
    fields: [
      {
        name: 'title',
        label: 'TITLE',
        type: 'text',
        placeholder: 'Enter todo title',
        required: true,
        validation: { required: 'Title is required' }
      },
      {
        name: 'dueDate',
        label: 'DUE DATE',
        type: 'date',
        defaultValue: '2025-08-15'
      },
      {
        name: 'repeatTodo',
        label: 'REPEAT TODO',
        type: 'text',
        placeholder: 'Add Repeat Todo'
      },
      {
        name: 'type',
        label: 'TYPE',
        type: 'dropdown',
        placeholder: 'Add Todo Type',
        options: ['Personal', 'Work', 'Shopping', 'Health', 'Finance', 'Other']
      },
      {
        name: 'projectName',
        label: 'PROJECT NAME',
        type: 'dropdown',
        placeholder: 'Add Project',
        options: ['Project A', 'Project B', 'Project C']
      },
      {
        name: 'taskName',
        label: 'TASK NAME',
        type: 'dropdown',
        placeholder: 'Add Task',
        options: ['Task 1', 'Task 2', 'Task 3']
      },
      {
        name: 'url',
        label: 'URL',
        type: 'url',
        placeholder: 'https://',
        hasGlobeIcon: true
      },
      {
        name: 'assigneeName',
        label: 'ASSIGNEE NAME',
        type: 'dropdown',
        placeholder: '+Add Assignee',
        options: ['John Doe', 'Jane Smith', 'Mike Johnson']
      }
    ],
    defaultValues: {
      title: '',
      dueDate: '2025-08-15',
      repeatTodo: '',
      type: '',
      projectName: '',
      taskName: '',
      url: '',
      assigneeName: ''
    }
  },
  
 [FORM_TYPES.TIMESHEET]: {
  title: 'NEW TIMESHEET',
  fields: [
    {
      name: 'date',
      label: 'DATE',
      type: 'date',
      defaultValue: '2025-08-15'
    },
    {
      name: 'partyName',
      label: 'PARTY NAME',
      type: 'search',
      placeholder: 'Search party...',
      required: true,
      validation: { required: 'Party name is required' }
    },
    {
      name: 'start',
      label: 'START',
      type: 'time',
      placeholder: '--:-- --',
      required: true,
      validation: { required: 'Start time is required' }
    },
    {
      name: 'stop',
      label: 'STOP',
      type: 'time',
      placeholder: '--:-- --',
      required: true,
      validation: {
        required: 'Stop time is required',
        validate: (value, allValues) => {
          if (!value || !allValues.start) return true; // skip if empty
          const startTime = new Date(`1970-01-01T${allValues.start}:00`);
          const stopTime = new Date(`1970-01-01T${value}:00`);
          return stopTime >= startTime || 'Stop time cannot be before start time';
        }
      }
    },
    {
      name: 'duration',
      label: 'DURATION',
      type: 'text',
      placeholder: 'Auto calculated',
      readonly: true
    },
    {
      name: 'projectName',
      label: 'PROJECT NAME',
      type: 'search',
      placeholder: 'Search project...',
      required: true,
      validation: { required: 'Project name is required' }
    },
    {
      name: 'taskName',
      label: 'TASK NAME',
      type: 'dropdown',
      placeholder: 'Add Task',
      options: ['Development', 'Testing', 'Design', 'Meeting', 'Documentation']
    },
    {
      name: 'remarks',
      label: 'REMARKS',
      type: 'textarea',
      placeholder: 'Add remarks...',
      rows: 4
    }
  ],
  defaultValues: {
    date: '2025-08-15',
    partyName: '',
    start: '',
    stop: '',
    duration: '',
    projectName: '',
    taskName: '',
    remarks: ''
  }
},

[FORM_TYPES.MOM]: {
  title: 'NEW MOM',
  fields: [
    {
      name: 'date',
      label: 'DATE',
      type: 'date',
      defaultValue: '2025-08-16',
      required: true,
      validation: { required: 'Date is required' }
    },
    {
      name: 'meetingName',
      label: 'MEETING NAME',
      type: 'text',
      placeholder: 'Enter meeting name',
      required: true,
      validation: { required: 'Meeting name is required' }
    },
    {
      name: 'selectProject',
      label: 'SELECT PROJECT',
      type: 'search',
      placeholder: 'Search and select project...',
      required: true,
      hasSearchIcon: true,
      validation: { required: 'Project selection is required' }
    },
    {
      name: 'attendee',
      label: 'ATTENDEE',
      type: 'search',
      placeholder: 'Search and add attendees...',
      hasSearchIcon: true,
      multiSelect: true
    },
    {
      name: 'notes',
      label: 'NOTES',
      type: 'textarea',
      placeholder: 'Add meeting notes...',
      rows: 6
    },
    {
      name: 'attachMedia',
      label: 'ATTACH MEDIA',
      type: 'file',
      placeholder: 'Attach files...',
      hasUploadIcon: true,
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi'
    }
  ],
  defaultValues: {
    date: '2025-08-16',
    meetingName: '',
    selectProject: '',
    attendee: [],
    notes: '',
    attachMedia: null
  }
},

[FORM_TYPES.LEAD]: {
    title: 'NEW LEAD',
    headerColor: 'purple',
    fields: [
      {
        name: 'leadAssignee',
        label: 'LEAD ASSIGNEE',
        type: 'dropdown',
        placeholder: 'Select assignee',
        required: true,
        options: ['Sagar', 'Priya', 'Amit', 'Rahul', 'Anita'],
        validation: { required: 'Lead assignee is required' }
      },
      {
        name: 'date',
        label: 'DATE',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
        validation: { required: 'Date is required' }
      },
      {
        name: 'leadType',
        label: 'LEAD TYPE',
        type: 'text',
        placeholder: 'Enter lead type',
        required: true,
        validation: { required: 'Lead type is required' }
      },
      {
        name: 'contactName',
        label: 'CONTACT NAME',
        type: 'text',
        placeholder: 'Enter contact name',
        required: true,
        validation: { required: 'Contact name is required' }
      },
      {
        name: 'contactNumber',
        label: 'PHONE NO.',
        type: 'tel',
        placeholder: 'Phone number',
        required: true,
        hasCountryCode: true,
        validation: { required: 'Phone number is required' }
      },
      {
        name: 'email',
        label: 'EMAIL',
        type: 'email',
        placeholder: 'Enter email address',
        validation: { 
          pattern: { 
            value: /\S+@\S+\.\S+/, 
            message: 'Email is invalid' 
          }
        }
      },
      {
        name: 'companyName',
        label: 'COMPANY NAME',
        type: 'text',
        placeholder: 'Enter company name'
      },
      {
        name: 'address',
        label: 'ADDRESS',
        type: 'textarea',
        placeholder: 'Enter address',
        rows: 3
      },
      {
        name: 'source',
        label: 'SOURCE',
        type: 'dropdown',
        placeholder: 'Select source',
        options: [
          'Website',
          'Instagram',
          'Facebook',
          'Google Ads',
          'Referral',
          'Cold Call',
          'Email Campaign',
          'Trade Show',
          'Other'
        ]
      },
      {
        name: 'category',
        label: 'CATEGORY',
        type: 'dropdown',
        placeholder: 'Select category',
        options: [
          'Hot Lead',
          'Warm Lead',
          'Cold Lead',
          'Qualified Lead',
          'Unqualified Lead'
        ]
      },
      {
        name: 'status',
        label: 'LEAD STATUS',
        type: 'dropdown',
        placeholder: 'Select status',
        defaultValue: 'New',
        options: [
          'New',
          'Contacted',
          'Qualified',
          'Proposal Sent',
          'Negotiation',
          'Closed Won',
          'Closed Lost'
        ]
      },
      {
        name: 'priority',
        label: 'PRIORITY',
        type: 'dropdown',
        placeholder: 'Select priority',
        defaultValue: 'Medium',
        options: ['High', 'Medium', 'Low']
      },
      {
        name: 'lastContactedDate',
        label: 'LAST CONTACTED DATE',
        type: 'date',
        placeholder: 'dd/mm/yyyy'
      },
      {
        name: 'followUpDate',
        label: 'FOLLOW UP DATE',
        type: 'date',
        placeholder: 'dd/mm/yyyy'
      },
      {
        name: 'expectedClosureDate',
        label: 'EXPECTED CLOSURE DATE',
        type: 'date',
        placeholder: 'dd/mm/yyyy'
      },
      {
        name: 'budget',
        label: 'BUDGET',
        type: 'number',
        placeholder: 'Enter budget amount',
        prefix: '₹'
      },
      {
        name: 'description',
        label: 'DESCRIPTION',
        type: 'textarea',
        placeholder: 'Enter description',
        rows: 4
      }
    ],
    defaultValues: {
      leadAssignee: '',
      date: new Date().toISOString().split('T')[0],
      leadType: '',
      contactName: '',
      contactNumber: '',
      email: '',
      companyName: '',
      address: '',
      source: '',
      category: '',
      status: 'New',
      priority: 'Medium',
      lastContactedDate: '',
      followUpDate: '',
      expectedClosureDate: '',
      budget: '',
      description: ''
    }
  }

};