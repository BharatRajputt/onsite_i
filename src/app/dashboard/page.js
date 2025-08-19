"use client"
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveItem} from '../store/sidebarSlice.js';
import Layout from '../component/Layout.jsx';

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveItem('dashboard'));
  }, [dispatch]);

  return (
    <Layout showHeader={true}>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </Layout>
  );
}