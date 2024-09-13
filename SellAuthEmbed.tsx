'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SellAuthEmbedProps {
  domain: string;
  product: string;
  quantity?: number;
  email?: string;
  method?: string;
  variant?: string;
}

const SellAuthEmbed: React.FC<SellAuthEmbedProps> = ({
  domain,
  product,
  quantity,
  email,
  method,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'sellauth-embed-style';
    style.textContent = `
      #sellauth-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 100vw;
        margin: auto;
        padding: 0;
        border: none;
        border-radius: 0.75rem;
        background-color: #121212;
        color: #ffffff;
        z-index: 1000;
      }

      #sellauth-modal .close {
        position: absolute;
        top: 1.125rem;
        right: 1.125rem;
        padding: 0.25rem;
        border: none;
        outline: none;
        cursor: pointer;
        background: none;
        color: #ffffff;
      }

      #sellauth-modal iframe {
        width: 98vw;
        height: 46rem;
        border: none;
      }

      @media (min-width: 768px) {
        #sellauth-modal {
          max-width: 32rem;
        }

        #sellauth-modal iframe {
          width: 32rem;
          height: 52rem;
        }
      }

      .sellauth-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.75);
        z-index: 999;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getProductIframeUrl = () => {
    let url = `https://${domain}/embed/product/${product}`;
    const params = new URLSearchParams({ embed: '1' });

    if (quantity) params.append('quantity', quantity.toString());
    if (email) params.append('email', email);
    if (method) params.append('method', method);
    if (variant) params.append('variant', variant);

    return `${url}?${params.toString()}`;
  };

  const openProductModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const Modal = () => (
    <>
      <div className="sellauth-backdrop" onClick={closeProductModal} />
      <div id="sellauth-modal">
        <button onClick={closeProductModal} className="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
          </svg>
        </button>
        <div role="alertdialog">
          <iframe
            src={getProductIframeUrl()}
            title="SellAuth Embed"
            referrerPolicy="no-referrer"
            allow="payment; clipboard-write"
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <button onClick={openProductModal}>Open SellAuth Modal</button>
      {isOpen && createPortal(<Modal />, document.body)}
    </>
  );
};

export default SellAuthEmbed;
