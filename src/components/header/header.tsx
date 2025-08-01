import React from 'react'
import './header.css'
import Image from 'next/image'

function Header() {
  return (
    <div className='header'>
      <div className='header-content'>
        <div className='title-section'>
          <h1 className='title-line-1'>Savor Every</h1>
          <h1 className='title-line-2'>Savor Every</h1>
          <h1 className='title-line-3'>Delicious</h1>
          <h1 className='title-line-4'>Moment</h1>
        </div>

        <div className='description'>
          <p>Experience the perfect blend of taste, quality, and convenience. Our handcrafted meals are made with love and the finest ingredients.</p>
        </div>

        <div className='button-section'>
          <button className='btn-primary'>Order Now</button>
          <button className='btn-secondary'>View Menu</button>
        </div>
      </div>
      <div className='header-image'>
        <Image
          id='header-image'
          src={"/main images/Healthy_Lifestyle_PSD__High_Quality_Free_PSD_Templates_for_Download___Freepik-removebg-preview.png"}
          width={400}
          height={400}
          alt="Header Image"
          priority
        />
      </div>

      <div className='scroll-indicator'>
        <span>Scroll Down</span>
        <div className='scroll-arrow'>↓</div>
      </div>
    </div>
  )
}

export default Header