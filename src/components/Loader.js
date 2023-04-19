import React from 'react'
import { TailSpin } from 'react-loader-spinner'

export default function Loader() {
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}><TailSpin
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
