// AuthContext.js
import { createContext, useContext, useState } from 'react';
import { getUser, login,register } from '../endpoints';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,setLoading]=useState(false);

  const signIn = async (email, password) => login(email,password).then((res)=>{
        setCurrentUser(res.data.user);
        localStorage.setItem('user',JSON.stringify(res.data.user))
        localStorage.setItem('token',res.data.tokens.access.token)
        return res
    }).catch((err)=> {throw err});

  const signUp = async (name, email, password, organization, username) => {
    register(name, email, password, organization, username).then((res)=>{
        setCurrentUser(res.data.user);
        localStorage.setItem('user',JSON.stringify(res.data.user))
        localStorage.setItem('token',res.data.tokens.access.token)
        return res;
    }).catch((err)=> {return err})
  };

  const signOut = async () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setCurrentUser(false)
  };

  const getCurrentUser = async () => {
    await getUser().then((res)=>{
      setCurrentUser(res.data)
      localStorage.setItem('user',JSON.stringify(res.data))
    }).catch((err)=>{
      setCurrentUser(false)
    })
  }
  

  const value = {
    signIn,
    signUp,
    signOut,
    currentUser,
    getCurrentUser,
    loading,
    setLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
