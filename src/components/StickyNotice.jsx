import React from 'react'
import styled from 'styled-components'
import CancelSvg from '!@svgr/webpack!../img/cancel.svg'

const StickyNoticeBase = ({ className = ``, onClose = () => {}, children, ...props }) => {
  return (
    <div className={`fixed z-50 pin-t pin-l w-full text-center p-3 ${className}`} {...props}>
      {children}
      <button className="close" onClick={onClose}><CancelSvg /></button>
    </div>
  )
}

const StickyNotice = styled(StickyNoticeBase)`
  .close {
    position: absolute;
    z-index: 10;
    right: .5rem;
    top: 50%;
    display: block;
    border: 0;
    padding: 0;
    background: none;
    transform: translateY(-50%);

    svg {
      max-width: 100%;
      height: auto;
    }

    @media (min-width: 768px) {
      right: 1.5rem;
    }
  }
  
  + .wrapper {
    padding-top: 2.8rem !important;

    @media (min-width: 992px) {
      padding-top: 5rem !important;
    }
  }
`

export default StickyNotice
