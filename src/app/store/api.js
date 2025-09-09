import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath:"onsite_api",
  baseQuery:fetchBaseQuery({
    baseUrl:"http://localhost:4000/api/",
    prepareHeaders:(headers,{getState})=>{
      const authToken = localStorage.getItem('authToken')
      if(authToken){
        headers.set('authorization',`Bearer ${authToken}`)
      }
      headers.set('content-type','application/json')
      return headers;
    }
  }),
  tagTypes: ['User', 'UserStats', 'Project', 'Member'], // Add cache tags
  endpoints:(builder)=>({

    // User Authentication Api's
    addUser:builder.mutation({
      query:(data)=>({
        url:`/auth/signup`,
        method:"POST",
        body:data
      })
    }),
    
    verifyOtp:builder.mutation({
      query:(data)=>({
        url:`/auth/verify-otp`,
        method:"POST",
        body:data
      })
    }),
    
    sigInUser:builder.mutation({
      query:(data)=>({
        url:`/auth/signin`,
        method:"POST",
        body:data
      })
    }),

    updateUserProfile:builder.mutation({
      query:()=>({

      })
    }),

    updateUserText: builder.mutation({
      query: (data) => ({
        url: '/auth/profile-text',
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => {
        console.log('Update Text Response:', response);
        return response;
      }
    }),


// Profile image only update
updateUserImage: builder.mutation({
  query: (imageFile) => {
    const formData = new FormData();
    formData.append('userImg', imageFile); // 🟢 Must match multer's field name
    console.log(imageFile);
    return {
      url: '/auth/profile-image',
      method: 'PUT',
      body: formData, // No need to set headers
    };
  },
}),


updateUserProfile: builder.mutation({
  query: (data) => {
    // Check if data is FormData (contains image) or regular object
    const isFormData = data instanceof FormData;
    
    return {
      url: '/auth/profile',
      method: 'PUT',
      body: data,
      // Don't set Content-Type for FormData, let browser handle it
      ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } })
    };
  },
  invalidatesTags: ['User', 'UserStats'],
  transformResponse: (response) => {
    console.log('Update Profile Response:', response);
    return response;
  },
  transformErrorResponse: (response) => {
    console.error('Update Profile Error:', response);
    return response.data || response;
  }
}),



    // User Profile APIs
    getUserProfile: builder.query({
      query: () => ({
        url: '/auth/get-profile',
        method: 'GET',
        
      }),
      providesTags: ['User'],
      // Transform response if needed
      transformResponse: (response) => {
        console.log('Profile API Response:', response);
        return response;
      },
      // Handle errors
      transformErrorResponse: (response, meta, arg) => {
        console.error('Profile API Error:', response);
        if (response.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
        }
        return response;
      }
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User'], // Refresh user data after update
      transformResponse: (response) => {
        console.log('Update Profile Response:', response);
        return response;
      }
    }),

    getUserStats: builder.query({
      query: () => ({
        url: '/user/stats',
        method: 'GET'
      }),
      providesTags: ['UserStats'],
      transformResponse: (response) => {
        console.log('User Stats Response:', response);
        return response;
      }
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: '/user/change-password',
        method: 'PUT',
        body: data
      }),
      transformResponse: (response) => {
        console.log('Change Password Response:', response);
        return response;
      }
    }),

    // Project APIs
    addProject:builder.mutation({
      query:(data)=>({
        url:"/project/addProject",
        method:"POST",
        body:data
      }),
      invalidatesTags: ['Project', 'UserStats'] // Refresh projects and stats
    }),

    getAllProjects:builder.query({
      query:(data)=>({
        url:"/project/getAllprojects",
        method:"GET"
      }),
      providesTags: ['Project']
    }),

    // Member APIs
    addMember:builder.mutation({
      query:(data)=>({
        url:`/party/add-parties`,
        method:"POST",
        body:data
      }),
      invalidatesTags: ['Member', 'UserStats'] // Refresh members and stats
    }),

    getMembers:builder.query({
      query:()=>({
        url:`/party/get-projectParty`,
        method:"GET"
      }),
      providesTags: ['Member']
    }),

    updateMember:builder.mutation({
      query:({id,updateData})=>({
        url:"/party/update-party",
        method:"PUT", // Changed from UPDATE to PUT
        body:updateData
      }),
      invalidatesTags: ['Member']
    }),


    //TIMESHEET APIS

    createTask: builder.mutation({
      query: (data) => ({
        url: '/timesheet/tasks',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Tasks'],
      transformResponse: (response) => {
        console.log('Create Task Response:', response);
        return response;
      }
    }),
    
    getTasksByProject: builder.query({
      query: (projectId) => ({
        url: `/timesheet/projects/${projectId}/tasks`,
        method: 'GET'
      }),
      providesTags: (result, error, projectId) => [
        { type: 'Tasks', id: projectId }
      ],
      transformResponse: (response) => {
        console.log('Get Tasks Response:', response);
        return response;
      }
    }),
    
    // Timesheet Management APIs
    addTimeSheet: builder.mutation({
      query: (data) => ({
        url: '/timesheet/timesheets',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Timesheets', 'UserStats'],
      transformResponse: (response) => {
        console.log('Add Timesheet Response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Add Timesheet Error:', response);
        return response.data || response;
      }
    }),
    
    getAllTimesheets: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        // Add pagination params
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        // Add filter params
        if (params.projectId) queryParams.append('projectId', params.projectId);
        if (params.partyId) queryParams.append('partyId', params.partyId);
        if (params.taskId) queryParams.append('taskId', params.taskId);
        if (params.status) queryParams.append('status', params.status);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        
        return {
          url: `/timesheet/timesheets?${queryParams.toString()}`,
          method: 'GET'
        };
      },
      providesTags: ['Timesheets'],
      transformResponse: (response) => {
        console.log('Get All Timesheets Response:', response);
        return response;
      }
    }),
    
    getTimesheetDetails: builder.query({
      query: (timesheetId) => ({
        url: `/timesheet/timesheets/${timesheetId}`,
        method: 'GET'
      }),
      providesTags: (result, error, timesheetId) => [
        { type: 'Timesheets', id: timesheetId }
      ]
    }),
    
    updateTimesheet: builder.mutation({
      query: ({ timesheetId, data }) => ({
        url: `/timesheet/timesheets/${timesheetId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, { timesheetId }) => [
        { type: 'Timesheets', id: timesheetId },
        'Timesheets'
      ],
      transformResponse: (response) => {
        console.log('Update Timesheet Response:', response);
        return response;
      }
    }),
    
    deleteTimesheet: builder.mutation({
      query: (timesheetId) => ({
        url: `/timesheet/timesheets/${timesheetId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, timesheetId) => [
        { type: 'Timesheets', id: timesheetId },
        'Timesheets',
        'UserStats'
      ],
      transformResponse: (response) => {
        console.log('Delete Timesheet Response:', response);
        return response;
      }
    }),
    
    // Helper/Search APIs for Timesheet Form
    searchProjects: builder.query({
      query: (searchQuery = '') => ({
        url: `/timesheet/projects/search?search=${encodeURIComponent(searchQuery)}`,
        method: 'GET'
      }),
      providesTags: ['Projects'],
      transformResponse: (response) => {
        console.log('Search Projects Response:', response);
        return response;
      }
    }),
    
    searchPartiesByProject: builder.query({
      query: ({ projectId, search = '' }) => ({
        url: `/timesheet/projects/${projectId}/parties/search?search=${encodeURIComponent(search)}`,
        method: 'GET'
      }),
      providesTags: (result, error, { projectId }) => [
        { type: 'Parties', id: projectId }
      ],
      transformResponse: (response) => {
        console.log('Search Parties Response:', response);
        return response;
      }
    }),
    



/////////////////////MOM APIS

  // Create new MOM with file upload
  addMom: builder.mutation({
    query: (formData) => ({
      url: '/mom/add-mom',
      method: 'POST',
      body: formData, // FormData object with files and other data
    }),
    invalidatesTags: ['MOM'],
  }),

  // Get all MOMs with filtering and pagination
getAllMoms: builder.query({
  query: ({ page = 1, limit = 10, projectId, attendeeId, startDate, endDate } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (projectId) params.append('selectProject_id', projectId);
    if (attendeeId) params.append('attendeeId', attendeeId); // assuming backend supports it
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    return {
      url: `/mom/getAllMom?${params.toString()}`,
      method: 'GET',
    };
  },
  providesTags: (result) =>
    result?.data
      ? [
          ...result.data.map(({ _id }) => ({ type: 'MOM', id: _id })),
          { type: 'MOM', id: 'LIST' },
        ]
      : [{ type: 'MOM', id: 'LIST' }],
}),


  
  









  
  // Get MOM by ID
  getMomById: builder.query({
    query: (id) => `/mom/${id}`,
    providesTags: (result, error, id) => [{ type: 'MOM', id }],
  }),

  updateMom: builder.mutation({
    query: ({ id, ...data }) => ({
      url: `/mom/${id}`,
      method: 'PUT',
      body: data,
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: 'MOM', id },
      { type: 'MOM', id: 'LIST' },
    ],
  }),

  deleteMom: builder.mutation({
    query: (id) => ({
      url: `/mom/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['MOM'],
  }),

  downloadAttachment: builder.mutation({
    query: ({ momId, fileName }) => ({
      url: `/mom/${momId}/attachment/${fileName}`,
      method: 'GET',
      responseHandler: (response) => response.blob(),
    }),
  }),

  getMomStats: builder.query({
    query: ({ startDate, endDate, projectId } = {}) => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (projectId) params.append('projectId', projectId);
      
      return `/mom/stats/overview?${params.toString()}`;
    },
    providesTags: ['MOM'],
  }),




    // Logout API (Optional)
    logoutUser: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'POST'
      }),
      // Clear all cache on logout
      invalidatesTags: ['User', 'UserStats', 'Project', 'Member']
    })

  })
})

export const {
  // Auth
  useAddUserMutation,
  useVerifyOtpMutation,
  useSigInUserMutation,
  
  // User Profile
  useGetUserProfileQuery,
  useGetUserStatsQuery,
  useChangePasswordMutation,
  useLogoutUserMutation,
  useUpdateUserProfileMutation,
  useUpdateUserImageMutation,
  useUpdateUserTextMutation,


  ////TIMESHEETS
  useAddTimeSheetMutation,
  useGetAllTimesheetsQuery,
  useGetTimesheetDetailsQuery,
  useUpdateTimesheetMutation,
  useDeleteTimesheetMutation,
  
///MOM API
useAddMomMutation,
  useGetAllMomsQuery,
  useGetMomByIdQuery,
  useUpdateMomMutation,
  useDeleteMomMutation,
  useDownloadAttachmentMutation,



  // Projects
  useAddProjectMutation,
  useGetAllProjectsQuery,

  // Members
  useAddMemberMutation,
  useGetMembersQuery,
  useUpdateMemberMutation

} = apiSlice