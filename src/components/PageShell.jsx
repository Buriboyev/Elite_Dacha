export default function PageShell({ children, className = '' }) {
  const classes = ['page-shell', className].filter(Boolean).join(' ')

  return <div className={classes}>{children}</div>
}
