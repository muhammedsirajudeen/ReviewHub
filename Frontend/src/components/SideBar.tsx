'use client'

import { ReactElement, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearAuthenticated, setUser } from '../store/globalSlice'
import url from '../helper/backendUrl'
import { Menu, X } from 'lucide-react'

export default function SideBar(): ReactElement {
  const user = useAppSelector((state) => state.global.user)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const page = useAppSelector((state) => state.global.page)
  const [isOpen, setIsOpen] = useState(false)

  const signoutHandler = () => {
    window.localStorage.clear()
    dispatch(clearAuthenticated())
    dispatch(
      setUser({
        paymentMethod: [],
        favoriteCourses: [],
        walletId: {
          history: [],
          userId: '',
          balance: 0,
          redeemable: 0,
        },
      })
    )
    navigate('/')
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  const NavItem = ({ href, imgSrc, isActive }:{href:string,imgSrc:string,isActive:boolean}) => (
    <a
      href={href}
      className={`flex items-center justify-center p-4 rounded-lg xs:mt-6 ${
        isActive ? 'bg-blue-400' : 'hover:bg-blue-300'
      } transition-colors duration-200`}
    >
      <img  src={imgSrc} alt="" className="w-5 h-5" />
    </a>
  )

  return (
    <div className="flex h-full">
      {/* Hamburger menu for mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-navbar rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed h-screen top-0 left-0 w-32 lg:w-28 flex flex-col items-center justify-start bg-navbar p-4 transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <h1 className="text-xl font-light text-white mb-10">OLP</h1>
        <NavItem
          href={user.authorization === 'reviewer' ? '/reviewer/dashboard' : '/user/dashboard'}
          imgSrc="/sidebar/dashboard.png"
          isActive={page === 'dashboard'}
        />
        <NavItem href="/user/courses" imgSrc="/sidebar/courses.png" isActive={page === 'course'} />
        <NavItem href="/user/blog" imgSrc="/sidebar/resource.png" isActive={page === 'blog'} />
        <NavItem href="/user/chat" imgSrc="/sidebar/chat.png" isActive={page === 'chat'} />
        <NavItem
          href={user.authorization === 'reviewer' ? '/reviewer/review' : '/user/review'}
          imgSrc="/sidebar/review.png"
          isActive={page === 'review'}
        />
        <NavItem
          href={user.authorization === 'reviewer' ? '/user/notifications' : '/user/notifications'}
          imgSrc="/sidebar/notification.png"
          isActive={page === 'notification'}
        />
        <button onClick={signoutHandler} className="mt-auto mb-4 cursor-pointer">
          <img src="/sidebar/logout.png" alt="Logout" className="w-6 h-6" />
        </button>
        <a href="/user/profile" className="mb-4">
          <img
            className="bg-white h-8 w-8 rounded-full object-cover"
            src={
              user.profileImage?.includes('http')
                ? user.profileImage
                : user.profileImage
                ? `${url}/profile/${user.profileImage}`
                : '/user.png'
            }
            alt="Profile"
          />
        </a>
      </nav>

      {/* Main content */}
      <div className="flex-1 lg:ml-28">
        <Outlet />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  )
}