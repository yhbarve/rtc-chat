export default function SystemMessage({msg, index}: {msg: string, index: number}) {
  return (
    <div key={index} className='text-center font-bold text-sm text-red-700'>
        ** {msg} **
    </div>
  )
}
