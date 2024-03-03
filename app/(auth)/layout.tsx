import React from 'react'
//This is a layout page for sign-in/sign-up page
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {children}
    </div>
  )
}

export default layout