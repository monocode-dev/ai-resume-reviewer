import React, { useState} from "react"
import { apiRequest } from "../api/client"
import type { Me } from "../types/types";

interface LoginPageProps {
  onLogin: (user: Me) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(email: string, password: string){
    return apiRequest<Me>('/auth/login', {
      method: "POST",
      body: JSON.stringify({email: email, password: password})
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    handleLogin(email, password)
    .then(res => {
      if(!res || res?.success === false || !res.data){
        setError(res?.message || 'Something went wrong');
        return;        
      }else{
        setEmail('');
        setPassword('')
        onLogin(res.data);
      }
    });
  }

return (
    <div>
        <h1>Welcome, Login</h1>
        <p>please login before moving forward</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email </label>
            <input type="email"
                   id="email"
                   placeholder="Email" 
                   onChange={(e) => setEmail(e.target.value)}
                   value={email} 
                   required/>

            <label htmlFor="password">Password </label>
            <input type="password" 
                   id="password"
                   placeholder="password" 
                   onChange={(e) => setPassword(e.target.value)} 
                   value={password}
                   required/>

            {error && <p className="form-error">{error}</p>}

            <button type="submit">Log In</button>
        </form>
    </div>
  )
}
