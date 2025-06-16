'use client';

import { useState, useEffect } from 'react';

const Footer = () => {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          &copy; {year} E-Commerce App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
