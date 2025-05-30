export default function OtherMessageBubble({user, msg, index}: {user: string, msg:string, index:number}) {
  return (
    <div key={index} className='flex flex-col bg-gray-300 text-white m-4 px-2 py-0.5 pr-4 rounded-md w-fit mr-auto'>
        <div className='text-gray-900 font-extrabold text-sm'>{user}</div>
        <div className='text-black font-bold'>{msg}</div>
    </div>
  )
}
