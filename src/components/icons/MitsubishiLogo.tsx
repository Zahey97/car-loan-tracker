import React from 'react';

const MitsubishiLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 114.3 132"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M57.15 0L0 66l57.15 66 57.15-66zM0 66l57.15-33 28.575 33-28.575 33zm57.15 33l28.575-33 28.575 33-57.15 33z" />
  </svg>
);

export default MitsubishiLogo;