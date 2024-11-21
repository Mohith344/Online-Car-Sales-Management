import React, { useState, useEffect } from 'react';
import { UserButton, useUser, SignInButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';

function Header() {
  const { isSignedIn } = useUser();
  const [showSignUp, setShowSignUp] = useState(false);

  // Handle "Escape" key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showSignUp) {
        setShowSignUp(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSignUp]);

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-sm p-5 z-10 flex justify-between items-center">
      <Link to="/">
        <img src="/vite.svg" width={50} height={50} alt="Vite Logo" />
      </Link>
      <ul className="hidden md:flex space-x-4">
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">Home</li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">Search</li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">New</li>
        <li className="font-medium hover:scale-105 transition-all cursor-pointer hover:text-primary">Preowned</li>
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
          <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
        </div>
      )}

      {/* Modal for SignUpForm */}
      {showSignUp && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-96">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Close modal"
            >
              ✕
            </button>
            <SignUpForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
