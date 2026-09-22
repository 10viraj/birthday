import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#160B28] text-white">
      <Outlet />
    </div>
  );
}
