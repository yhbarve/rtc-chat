export default function MyMessageBubble({msg, index}: {msg:string, index:number}) {
  return (
    <div key={index} className='flex flex-col bg-green-300 text-white items-end m-4 px-2 pl-4 rounded-md w-fit ml-auto'>
        <div className='text-green-900 font-extrabold text-sm'>Me</div>
        <div className='text-black font-bold'>{msg}</div>
    </div>
  )
}
