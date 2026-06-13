const Logo = ({ className = "" }) => (
  <svg viewBox="0 0 280 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer border */}
    <rect x="2" y="2" width="276" height="76" rx="4" ry="4" fill="none" stroke="black" strokeWidth="3" />
    {/* Top line accent */}
    <line x1="40" y1="2" x2="240" y2="2" stroke="black" strokeWidth="3" />
    {/* Bottom line accent */}
    <line x1="40" y1="78" x2="240" y2="78" stroke="black" strokeWidth="3" />
    {/* Left vertical accent */}
    <line x1="2" y1="20" x2="2" y2="60" stroke="black" strokeWidth="3" />
    {/* Right vertical accent */}
    <line x1="278" y1="20" x2="278" y2="60" stroke="black" strokeWidth="3" />
    {/* HR LIFE STYLE text */}
    <text x="140" y="40" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontStyle="italic" fontSize="26" fill="black" letterSpacing="2">
      HR LIFE STYLE
    </text>
    {/* BUY WITH FAITH text */}
    <text x="140" y="60" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="500" fontSize="13" fill="black" letterSpacing="6">
      BUY WITH FAITH
    </text>
    {/* Horizontal divider lines around "BUY WITH FAITH" */}
    <line x1="60" y1="48" x2="105" y2="48" stroke="black" strokeWidth="1.5" />
    <line x1="175" y1="48" x2="220" y2="48" stroke="black" strokeWidth="1.5" />
  </svg>
);

export default Logo;
