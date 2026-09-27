import { useState} from "react"
import type { Me } from "../types/types";
import { apiRequest } from "../api/client";

interface LoginPageProps {
  onLogin: (user: Me) => void;
}

export default function SignupPage({ onLogin }: LoginPageProps){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    function handleSignup(email: string, password: string){
        return apiRequest<Me>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({email: email, password: password})
        });
    }

    function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        handleSignup(email, password)
        .then(res => {
        if (!res || res.success === false || !res.data) {
          setError(res?.message || 'Something went wrong');
          return;
        } else {
          setEmail('');
          setPassword('');
          onLogin(res.data);
        }
      })
    }


  return (
    <div>
        <h1>Welcome, Sign Up</h1>
        <p>please sign up before moving forward</p>
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

            <button type="submit">Sign Up</button>
        </form>
    </div>
  )
}
