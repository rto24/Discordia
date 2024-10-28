import React from 'react'
import { Button } from './ui/button';

const Login = () => {

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/discord';
  };

  return (
    <div>
      <Button onClick={handleLogin}>Login with Discord</Button>
    </div>
  )
}

export default Login;