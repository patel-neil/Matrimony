// src/components/ui/alert.jsx
export const Alert = ({ children, className }) => (
    <div className={`p-4 rounded-md ${className}`}>
      {children}
    </div>
  );
  
  export const AlertDescription = ({ children }) => (
    <p className="text-sm">{children}</p>
  );