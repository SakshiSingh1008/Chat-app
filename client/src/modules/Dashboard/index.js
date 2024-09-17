import React, { useEffect, useState,useRef } from 'react'
import User from '../../assets/user.svg'
import Input from '../../components/Input'
import Img1 from '../../assets/img1.jpg'
import{ io } from 'socket.io-client'
import Img2 from '../../assets/img2.jpg'




const Dashboard = () => {
  const[user,setUser]=useState(JSON.parse(localStorage.getItem('user:detail')))
  const[conversation,setConversation]=useState([])
  const[messages,setMessages]=useState({})
  const[message,setMessage]=useState(' ')
  const[users,setUsers]=useState([])
  const[socket,setSocket]=useState(null)
  const messageRef=useRef(null)
  
  
   useEffect(() =>{
  setSocket(io('http://localhost:8080'))
  },[])
  
  useEffect(() =>{
   socket?.emit('addUser',user?.id);
   socket?.on('getUsers',users =>{
    console.log('activeUsers:>>',users);
   })
   socket?.on('getMessage',data =>{
    
    setMessages(prev=>({
      ...prev,
      messages:[...prev.messages, {user:data.user, message:data.message}]
    }))
   })
  },[socket])

  useEffect(() =>{
    messageRef?.current?.scrollIntoView({behaviour:'smooth'})
  },[messages?.messages])
 
 
  useEffect(() =>{
  const loggedInUser=JSON.parse(localStorage.getItem('user:detail'))
  const fetchConversation = async() =>{
    const res = await fetch(`http://localhost:8000/api/conversation/${loggedInUser?.id}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      }
    });
    const resData = await res.json()
    
    setConversation(resData)
  }
  fetchConversation()
 },[])
  
useEffect(() =>{
  const fetchUsers=async() =>{
    const res=await fetch(`http://localhost:8000/api/users/${user?.id}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      }
    });
    const resData=await res.json()
    setUsers(resData)
  }
  fetchUsers()
},[])
  
 


 const fetchMessages = async(conversationId, receiver)=>{
  const res = await fetch(`http://localhost:8000/api/message/${conversationId}?
    senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,{
  method:'GET',

  headers:{
    'Content-Type':'application/json',
  },
  });
  const resData =await res.json()
  console.log('resData:>>',resData);
  setMessages({messages:resData, receiver,conversationId});

 }

 const sendMessage=async(e) =>{
  setMessage(' ')
  socket?.emit('sendMessage',{
    senderId:user?.id,
    message,
    receiverId:messages?.receiver?.receiverId,
    conversationId:messages?.conversationId
  });
  
  const res = await fetch(`http://localhost:8000/api/message`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({ 
      conversationId:messages?.conversationId,
      senderId: user?.id,
      message,
      receiverId:messages?.receiver?.receiverId,
    })
  });
  


 }

  return (
    <div className='w-screen flex '>
    <div className='w-[25%] h-screen bg-[#f7f7f8] overflow-scroll'>
     <div className='flex  items-center my-6 mx-14  '>
     <div ><img src  ={Img2}  className='w-[95px] h-[70px] border border-primary p-[2px] rounded-full' /></div>
     <div className='ml-6  '>
        <h3 className='text-2xl'>{user?.fullName}</h3>
        <p className='text-lg font-light text-xl mt-2 '>My Account</p>
     </div>
     </div>
     <hr />
     <div className='mx-6 mt-2'>
      <div className=' text-xl text-primary font-semi bold'>
        Messages
      </div>
      <div>
       {
        conversation.length>0 &&
        conversation.map(({conversationId,user}) =>{
          
            return(
              <div className='flex  items-center py-4 border-b border-b-gray-300 '>
                <div className='cursor-pointer flex items-center' onClick={() =>
                  fetchMessages(conversationId, user)}>
                
             <div><img src ={User} className='w-[60px] h-[60px] border border-primary rounded-full p-[2px]' /></div>
              <div className='ml-6'>
                   <h3 className='text-lg font-semi-bold'>{user?.fullName}</h3>
                    <p className='text-sm  text-gray-600'>{user?.email}</p>
                     </div>
                     </div>
             </div>
            )
          })
       }
        
      </div>
     </div>
    </div>
    <div className='w-[50%] bg-white h-screen flex flex-col items-center '>
    {
  messages?.receiver?.fullName && (
    <div className='w-[85%] bg-blue-100 h-[60px] my-8 rounded-full flex items-center py-2 px-14'>
      <div className='cursor-pointer'>
        <img src={Img1}  className='rounded-full w-[50px] h-[50px] '/>
      </div>
      <div className='ml-4 mr-auto'>
        <h3 className='text-lg '>{messages?.receiver?.fullName}</h3>
        <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
      </div>
      <div className='cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-call" 
          width="25" height="25" viewBox="0 0 24 24" strokeWidth="1.7" stroke="black" fill="none"
          strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
          <path d="M15 7a2 2 0 0 1 2 2" />
          <path d="M15 3a6 6 0 0 1 6 6" />
        </svg>
      </div>
    </div>
  )
}

   <div className='h-[90%] border w-full overflow-scroll shadow-sm'>
    <div className='p-14 '>
           {
            messages?.messages?.length >0 ?
            messages.messages.map(({message, user :{ id } = {} }) =>{
              return(
               <>
                <div className={`max-w-[40%] rounded-b-xl p-4  mb-6 ${id === user?.id ? 
                  'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-blue-100 text-black rounded-tr-xl'}`}>
                  {message}</div>
                  <div ref={messageRef}></div>
                </>
              )
            }):<div className='text-center text-lg font-semibold mt-8'>No Messages or no Conversation Selected</div>
           }

    </div>
   </div>
     
      
      
       {
        messages?.receiver?.fullName &&
       
      
    
    <div className='px-10 py-4 w-full flex items-centre justify-centre  '>
      
      <Input placeholder='Type a message... 'value ={message} onChange={(e) => setMessage(e.target.value)}
      className='w-[75%]  ' 
      inputClassName='p-3  shadow-md rounded-full  outline-none
       focus:ring-0  focus:border-0 bg-[#f7f7f8]  '/>
       <div className={`ml-10 p-1 cursor-pointer bg-light rounded-full ${!message &&'pointer-events-none'}`} onClick={() => sendMessage()}>
       <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-send"
        width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none"
         stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 14l11 -11" />
      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
     </svg>
       </div>
       <div className={`ml-4 p-1 cursor-pointer bg-light rounded-full ${!message &&'pointer-events-none'}`}>
       <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-plus-filled" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm0 6a1 1 0 0 0 -1 1v2h-2l-.117 .007a1 1 0 0 0 .117 1.993h2v2l.007 .117a1 1 0 0 0 1.993 -.117v-2h2l.117 -.007a1 1 0 0 0 -.117 -1.993h-2v-2l-.007 -.117a1 1 0 0 0 -.993 -.883z" fill="currentColor" stroke-width="0" />
</svg>
       </div>
    </div>
}
    </div>
    <div className='w-[25%]  h-screen bg-[#f7f7f8] px-8   py-8 overflow-scroll  '>
    <div className='  text-primary  mb-3  text-2xl'> People </div>
    <div>
       {
        users.length>0 &&
        users.map(({userId,user}) =>{
          
            return(
              <div className='flex  items-center py-4 border-b border-b-gray-300 '>
                <div className='cursor-pointer flex items-center' onClick={() =>fetchMessages('new', user)}>
                <div><img src ={User} className='w-[60px] h-[60px] border border-primary rounded-full p-[2px]' /></div>
              <div className='ml-6'>
                   <h3 className='text-lg font-semi-bold'>{user?.fullName}</h3>
                    <p className='text-sm  text-gray-600'>{user?.email}</p>
                     </div>
                     </div>
             </div>
            )
          })
       }
        
      </div>
    </div>
    </div>
  )
}

export default Dashboard