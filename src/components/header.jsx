import React from 'react';
import { UserButton, useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-sm p-5 z-10 flex justify-between items-center">
      <img src="/vite.svg" width={50} height={50} alt="Vite Logo" />

      <ul className="hidden md:flex space-x-4">
        <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Home</li>
        <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Search</li>
        <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>New</li>
        <li className='font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary'>Preowned</li>
      </ul>

      {isSignedIn ? (
        <div className="flex space-x-4">
          <UserButton />
          <Link to="/profile">
            <Button>Submit Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="flex space-x-4">
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>

        </div>
      )}
    </div>
  );
}

export default Header;