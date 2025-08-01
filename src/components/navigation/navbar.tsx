"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { useRestaurant } from '../../context/RestaurantContext'
import './navbar.css'

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { cart } = useRestaurant()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0)

    return (
        <div className='navbar'>
            <div className='navbar-container'>
                <div className='navbar-logo'>
                    <Link id='logo' href='/'>Brand Name</Link>
                </div>
                <ul className={`navbar-list ${isMenuOpen ? 'active' : ''}`}>
                    <li className='navbar-item'>
                        <Link href='/' onClick={closeMenu}>Home</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link href='/about' onClick={closeMenu}>About</Link>
                    </li>
                    <li className='navbar-item'>
                        <Link href='/contact' onClick={closeMenu}>Contact</Link>
                    </li>
                    <li className='navbar-item cart-item'>
                        <Link href='/cart' onClick={closeMenu} className='cart-link'>
                            Cart
                            {cartItemCount > 0 && (
                                <span className='cart-count'>{cartItemCount}</span>
                            )}
                        </Link>
                    </li>
                    <li className='navbar-item'>
                        <Link href='/admin' onClick={closeMenu}>Admin</Link>
                    </li>
                </ul>
                <div className='navbar-cta'>
                    <Link href='/cart'>Get Started</Link>
                </div>
                <div
                    className={`mobile-navbar-toggle ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </div>
    )
}

export default Navbar
