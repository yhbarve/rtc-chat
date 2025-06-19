import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate();
    function handleGoToHome(){
        navigate('/');
    }

    function handleGoToAbout(){
        navigate('/about');
    }

  return (
    <div className='p-4 my-4 bg-gradient-to-tr from-blue-500 to-purple-800 rounded-md shadow-xl flex justify-between'>
        <button className='cursor-pointer text-2xl font-semibold text-white' onClick={handleGoToHome}>Chattr</button>
        <div className='flex gap-4'>
            <button className='backdrop-blur-lg px-2 py-0.5 rounded-md cursor-pointer text-white hover:bg-white/10 font-semibold transition ease-in-out' onClick={handleGoToHome}>Home</button>
            <button className='backdrop-blur-lg px-2 py-0.5 rounded-md cursor-pointer text-white hover:bg-white/10 font-semibold transition ease-in-out' onClick={handleGoToAbout}>About</button>
        </div>
    </div>
  )
}
