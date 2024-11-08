import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error("Failed to logout", error)
        }
    }

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            <button onClick={handleLogout} className='ml-4 p-2 bg-red-500 text-white rounded'>Logout</button>
        </div>
    )
}

export default Home