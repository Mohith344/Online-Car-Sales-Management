// frontend/src/components/SignUpForm.jsx
import React, { useState, useEffect } from 'react';
import { useSignUp, useUser } from '@clerk/clerk-react';
import { useForm } from 'react-hook-form';
import './SignUpForm.css';

function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp(); // Access Clerk instance if needed
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [feedback, setFeedback] = React.useState(''); // To prevent multiple submissions

  // Effect to send user data to the backend once the user is available
  

  const onSubmit = async (data) => {
    const { firstName, lastName, email, password, username } = data;

    try {
      console.log('Submitting sign-up data:', { email, password, firstName, lastName, username });

      const createdSignUp = await signUp.create({
        emailAddress: email,
        password: password,
        firstName,
        lastName,
        username,
      });

      console.log('Created SignUp:', createdSignUp);

      if (createdSignUp.status === 'complete') {
        await setActive({ session: createdSignUp.createdSessionId });
        setFeedback('Sign-up successful!');
         // User should now be available
         const sendUserData = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                email: email,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Backend error: ${errorData.message}`);
            }

            const result = await response.json();
            console.log(result.message);
          } catch (error) {
            console.error('Error sending user data to backend:', error);
            setFeedback('Sign-up succeeded, but failed to send data to server.');
          } finally {
            reset(); // Reset the form fields
          }
        };

        sendUserData();
      } else if (createdSignUp.status === 'needsVerification') {
        setFeedback('Please verify your email to complete sign-up.');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      if (error?.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        setFeedback(clerkError.message);
        console.error('Clerk Error:', clerkError);
      } else {
        setFeedback('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="signup-form-container bg-slate-100 rounded-sm">
      <h2>Create an Account</h2>
      {feedback && <p className="feedback-message">{feedback}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">

        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            className='bg-blue-100 rounded-sm border border-blue-200'
            id="firstName"
            type="text"
            {...register('firstName', { required: 'First name is required.' })}
          />
          {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            className='bg-blue-100 rounded-sm border border-blue-200'
            id="lastName"
            type="text"
            {...register('lastName', { required: 'Last name is required.' })}
          />
          {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
        </div>

        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            className='bg-blue-100 rounded-sm border border-blue-200'
            id="username"
            type="text"
            {...register('username', { required: 'Username is required.' })}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            className='bg-blue-100 rounded-sm border border-blue-200'
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Entered value does not match email format.',
              },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className='bg-blue-100 rounded-sm border border-blue-200'
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required.',
              minLength: {
                value: 6,
                message: 'Password must have at least 6 characters.',
              },
            })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;