export default function GlassCard({ children, className = "", ...props }) {
  return (
    <div className={`glass panel-card shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}
