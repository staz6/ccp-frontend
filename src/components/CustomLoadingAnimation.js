import React from 'react'
import { TailSpin } from 'react-loader-spinner'

export default function CustomLoadingAnimation({isLoading}) {
  if(!isLoading) return null;
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%',width:'100%',position:"fixed",zIndex:"999999999",backgroundColor:"black",opacity:"0.3"}}><TailSpin
    height="80"
    width="80"
    color="#103996"
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass=""
    visible
  /></div>
  )
}
