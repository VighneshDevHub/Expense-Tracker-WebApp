import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">Expense Tracker &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;