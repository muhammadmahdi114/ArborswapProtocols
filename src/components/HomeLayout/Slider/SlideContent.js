import React from 'react'
import { BACKEND_URL } from 'config/constants/LaunchpadAddress'

export default function SlideContent({name, img, mobile }) {
  if (mobile) {
    return (
      <div className="w-full px-2">
        <img className="w-full" src={`${BACKEND_URL}${img}`} alt={name}/>
      </div>
    )
  }
  return (
      <div className="w-1/3 pr-2">
        <img className="w-full rounded-xl" src={`${BACKEND_URL}${img}`} alt={name} />
      </div>
  )
}
