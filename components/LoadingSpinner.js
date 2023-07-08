const LoadingSpinner = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="80"
    height="80"
    stroke="#800080"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#9f57c9" fill="none">
      <animate
        attributeName="stroke-dasharray"
        repeatCount="indefinite"
        dur="1.5s"
        values="0 20;20 0;0 20"
      />
    </circle>
  </svg>
);

export default LoadingSpinner;
