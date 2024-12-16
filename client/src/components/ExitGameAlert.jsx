import {useNavigate} from 'react-router-dom';

export default function ExitGameAlert(){
    const navigate = useNavigate()
    const roomId = sessionStorage.getItem("roomId")

    function handleClick(){
        console.log('click')
    }

    return (
        <div className = "sure-alert">
            <p>Are you sure?</p>
            <button onClick={()=>navigate(`${roomId}/score-calculation`)}>Yes - take us to the final scores</button>
            <button onClick={handleClick}>Oops - no not finished yet</button>
        </div>
    )
}