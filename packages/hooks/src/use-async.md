# useAsync Hook

The `useAsync` hook is a custom React hook designed to simplify the management of asynchronous operations in functional components. It addresses three key challenges:

1. Prevents calling `setState()` on unmounted components, avoiding potential memory leaks.
2. Manages asynchronous UI states efficiently.
3. Handles race conditions when dealing with multiple asynchronous calls.

## Usage

Here's an example demonstrating how to use the `useAsync` hook in a React component:

```tsx
import React from 'react';
import useAsync from './useAsync';

const fetchUserById = (userId) => {
  return fetch(`https://api.example.com/users/${userId}`)
    .then(response => response.json());
};

const UserProfile = ({ userId }) => {
  const {
    data: user,
    error,
    status,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    reset
  } = useAsync();

  const handleFetchUser = () => {
    run(fetchUserById(userId), {
      onSuccess: (data) => {
        console.log('User fetched successfully:', data);
      },
      onError: (error) => {
        console.error('Error fetching user:', error);
      },
      onSettled: () => {
        console.log('Fetch operation completed');
      }
    });
  };

  return (
    <div>
      <button
        disabled={isLoading}
        onClick={handleFetchUser}
      >
        {isIdle ? 'Fetch User' : 'Refresh User Data'}
      </button>

      {isError && <p>Error occurred: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      {isSuccess && user && (
        <div>
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
```
