import React, { useState } from 'react'

const TokenImage = ({ src, alt, className }) => {
  const [isUndefined, updateIsUndefined] = useState(false)

  const onError = () => {
    updateIsUndefined(true)
  }

  if (isUndefined) {
    return <span className={"text-[36px] top-[2px] z-10 relative"}>🧐</span>
  }

  return <img src={src} alt={alt} className={className} onError={onError} />
}

export default React.memo(TokenImage, () => true)
