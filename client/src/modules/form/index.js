import Button from "../../components/Buttons"
import Input from "../../components/Input"
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Form = ({ isSignInPage =true, }) => {
  const navigate = useNavigate();

  const[data,setData]=useState({
    ...(!isSignInPage &&{
      fullName:''
    }),
    email:'',
    password:''
  })
  

 
  const handleSubmit=async(e)=>{
    console.log("data:>>", data);
    e.preventDefault();
      const res = await fetch(`http://localhost:8000/api/${isSignInPage? 'login':'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if(res.status===400){
        alert('Invalid Credentials')
      }else{
        const resData=await res.json()
       if(resData.token){
        localStorage.setItem('user:token',resData.token)
        localStorage.setItem('user:detail',JSON.stringify(resData.user))
        navigate('/')
       }
       }
       }
 

  return (
    <div className="bg-light h-screen flex items-centre justify-centre ">
    <div className="bg-white w-[600px] h-[550px] shadow-lg rounded-lg flex flex-col 
    justify-center 
    items-center mx-auto my-auto">
    <div className="text-3xl font-bold">Welcome
       {isSignInPage && " back"}</div>
    <div className="text-xl font-light mb-14">
      {isSignInPage?"Sign in to explore":"Sign up now to get started"}</div>
      <form className='flex flex-col items-centre w-[65%]'onSubmit={(e) => handleSubmit(e)}>
   {!isSignInPage && <Input label="Fullname" name="name" placeholder="Enter your Full name" className="mb-6 w-[100%]"
   value={data.fullName} onChange={(e)=>setData({...data,fullName:e.target.value})}/>}
    <Input label="Email address" name="email" type="email" placeholder="Enter your email" className="mb-6 w-[100%]"
    value={data.email} onChange={(e)=>setData({...data,email:e.target.value})}/>
    <Input label="Password" type="password" name="password" placeholder="Enter your Password" className="mb-14 w-[100%]"
    value={data.password} onChange={(e)=>setData({...data,password:e.target.value})}/>
    <Button label = {isSignInPage ? "Sign in":"Sign up"} type="submit"className="w-full mb-2"/> 
    </form>
    <div>{isSignInPage ? "Didn't have an account?":"Already have an account?"}
      <span className="text-primary cursor-pointer underline" onClick={()=> navigate(`/users/${isSignInPage ? "sign-up":"sign-in"}`)}>{isSignInPage?"Sign-up":"Sign-in"}</span>
      </div>
    </div>
    </div>
  )

}
export default Form;