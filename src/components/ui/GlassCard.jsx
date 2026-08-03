/**
 * Reusable glassmorphism card wrapper.
 */
const GlassCard = ({ children, className = '', as: Tag = 'div', ...rest }) => (
  <Tag
    className={`rounded-[20px] border border-[var(--white-20)] bg-[var(--white-10)]
      backdrop-blur-xl shadow-[0_0_32px_rgba(110,231,183,0.25)] ${className}`}
    {...rest}
  >
    {children}
  </Tag>
)

export default GlassCard
