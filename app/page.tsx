import React from 'react'

const page = () => {
  return (
    <>
   <div className="bg-bg">Page background</div>
<div className="bg-bg-muted">Card / muted section background</div>

// Brand
<button className="bg-brand-primary text-white">Primary action</button>
<span className="text-brand-secondary">Secondary accent text</span>

// Status — great for badges, alerts, toasts
<p className="text-success">Payment successful</p>
<div className="bg-success/10 text-success border border-success/20 rounded-md p-3">
  Order confirmed
</div>

<div className="bg-warning/10 text-warning border border-warning/20 rounded-md p-3">
  Low stock warning
</div>

<div className="bg-error/10 text-error border border-error/20 rounded-md p-3">
  Payment failed
</div>

<div className="bg-info/10 text-info border border-info/20 rounded-md p-3">
  New feature available
</div>
</>
  )
}

export default page