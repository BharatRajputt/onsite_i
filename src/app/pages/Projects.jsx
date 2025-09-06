


"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setActiveItem } from '../store/sidebarSlice.js';
import { 
  selectAllProjects, 
  selectPinnedProjects, 
  togglePinProject, 
  duplicateProject 
} from '../store/projectSlice.js';
import Table from '../component/table/Table.jsx';
import { BookCheck, List, Search, SquareCheckBig, Truck } from 'lucide-react';
import { FORM_TYPES } from '../config/formConfig.js';
import {useGetAllProjectsQuery}  from '../store/api'

export default function Projects() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get projects from Redux store

  const { dataaa, errorrr, isLoadingg } = useGetAllProjectsQuery();
const allProjectssss = dataaa ; // 👈 Extract array safely

console.log(allProjectssss);


  const { data: allProjects, error, isLoading } = useGetAllProjectsQuery();
  console.log("all projectsss ",allProjects?.data);


  const projects = useSelector(state=>state.projects);
  const data = {...projects}
  const pinnedProjectIds = useSelector(selectPinnedProjects);
const goTodo=()=>{
  router.push('/todo')
}

const handleClickColumn = ()=>{
  router.push('/transaction')
}


  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => (
        <div onClick={handleClickColumn} className="flex items-center">
          <div className="rounded-full flex items-center justify-center mr-3">
            <span className="text-purple-600 font-medium text-sm">
              {
                item.projectName
              }
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.location}</div>
          </div>
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${value}%` }}
          ></div>
          <span className="text-xs text-gray-500 mt-1 block">{value}%</span>
        </div>
      )
    },
    {
      key: 'inout',
      label: 'In/Out',
      render: (value, item) => (
        <span className="text-sm text-gray-600">
          ₹ {item.income || 0} / ₹ {item.expense || 0}
        </span>
      )
    },
    {
      key: 'todo',
      label: 'To Do',
      render: (value) => (
        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
          <span className="text-orange-600 font-medium text-sm">{value}</span>
        </div>
      )
    }
  ];

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState(['name', 'progress', 'inout', 'todo']);

  // Handle column toggle
  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };


   const handleEditProject = (timesheet) => {
      console.log('Edit timesheet:', timesheet);
      // You can implement edit functionality here by passing data to modal
      openModal(FORM_TYPES.PARTY);
    };
  // Handle pin toggle
  const handlePinProject = (projectId) => {
    dispatch(togglePinProject(projectId));
  };

  // Handle project duplication
  const handleDuplicateProject = (project) => {
    dispatch(duplicateProject(project.id));
  };

  // Handle new project click
  const handleNewProject = () => {
    router.push('/projects/create');
  };

  useEffect(() => {
    dispatch(setActiveItem('projects'));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <Header title="Projects" notificationCount={3} /> */}
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            {/* <p className="text-gray-600">Manage your construction projects</p> */}
          </div>
          <button
            onClick={handleNewProject}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span>+</span>
            New Project
          </button>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 cursor-pointer">
        <div className="bg-white p-6 rounded-lg shadow-sm border-white">
          <div className="flex items-center justify-between ">
            <div>
              <p className="text-sm text-gray-500 mb-1 ">Approval (Pending)</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookCheck/>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-whiter">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Material (Pending)</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Truck/>
              
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-white">
          <div onClick={goTodo} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 " >To Do (Pending)</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
             <SquareCheckBig/>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All</option>
            <option>Active</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>
        <div className="relative">
          
          <input
            type="text"
            placeholder="Search Projects"
            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            
          />
          
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Projects Table */}
      <Table
        data={allProjects?.data}
        columns={columns}
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onPinProject={handlePinProject}
        onDuplicateProject={handleDuplicateProject}
        pinnedProjects={pinnedProjectIds}
        onEditProject={handleEditProject}
        emptyMessage="No projects found. Click 'New Project' to get started."
      />
      </div>  
    </div>
  );
}