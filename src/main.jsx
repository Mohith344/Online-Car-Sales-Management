import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './home'
import Contact from './contact'
import Profile from './Profile'
import AddListing from './add-listing'
import { ClerkProvider } from '@clerk/clerk-react'
import SearchByCategory from './Search/[category]'
import SearchByOptions from './Search'
import ListingDetail from './listing-details/[id]'
import Payment from './components/Payment'
import Confirmation from './components/Confirmation'
import TestDriveBooking from './components/TestDriveBooking'
import SignUpForm from './components/SignUpForm'

// creating a route

const router = createBrowserRouter([
   {
    path: '/',
    element: <Home />,
   },
   {
    path: '/contact',
    element: <Contact />,
   },
   {
    path: '/profile',
    element: <Profile />,
   },
   {
    path: '/add-listing',
    element: <AddListing />,
   },
   {
    path: '/add-listing/:id',
    element: <AddListing />
   },
   {
    path: '/Search',
    element:<SearchByOptions />
   },
   {
    path: '/Search/:category',
    element:<SearchByCategory />
   },
   {
    path:'/listing-details/:id',
    element: <ListingDetail />
   },
   {
    path: '/payment/:id',
    element: <Payment />
   },
   {
    path: '/confirmation',
    element: <Confirmation />
   },
   {
    path:'/test-drive-booking/:id',
    element: <TestDriveBooking />
   },
   {
    path: '/signup',
    element: <SignUpForm />,
  }
])

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)