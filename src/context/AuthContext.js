// AuthContext.js
import { createContext, useContext, useState } from 'react';
import { getUser, login,register } from '../endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const signIn = async (email, password) => login(email,password).then((res)=>{
        setCurrentUser(res.data.user);
        localStorage.setItem('user',JSON.stringify(res.data.user))
        localStorage.setItem('token',res.data.tokens.access.token)
        return res
    }).catch((err)=> {throw err});

  const signUp = async (name, email, password, organization, username) => {
    login(name, email, password, organization, username).then((res)=>{
        setCurrentUser(res.data.user);
        localStorage.setItem('user',JSON.stringify(res.data.user))
        localStorage.setItem('token',res.data.tokens.access.token)
        return res;
    }).catch((err)=> {throw err})
  };

  const signOut = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setCurrentUser(null)
  };

  const getCurrentUser = async () => {
    await getUser().then((res)=>{
      setCurrentUser(res.data)
      localStorage.setItem('user',JSON.stringify(res.data))
    })
  }
  

  const value = {
    signIn,
    signUp,
    signOut,
    currentUser,
    getCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
