import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../style/ScoreCalculation.css'

export default function ScoreCalculations(){

    const [finalScores, setFinalScores] = useState([])

    const roomId = sessionStorage.getItem('roomId')

    useEffect(()=>{

        async function getFinalScores(){
            const response = await fetch(`/api/${roomId}`)
            const data = await response.json();
            console.log('Ratings data:', data);

            const scoresByWine = data.reduce((acc, { wineNumber, rating }) => {
                if (!acc[wineNumber]) {
                    acc[wineNumber] = { total: 0, count: 0 };
                }
                acc[wineNumber].total += rating;
                acc[wineNumber].count++;
                return acc;
            }, {});

            console.log('Scores by wine:', scoresByWine);

            const averages = Object.entries(scoresByWine)
                .map(([wineNumber, { total, count }]) => ({
                    wineNumber: Number(wineNumber),
                    averageScore: (total / count).toFixed(2), // Round to 2 decimals
                }))
                .sort((a, b) => b.averageScore - a.averageScore); // Sort by score descending

            console.log('Averages:', averages);
            setFinalScores(averages);        
        }

        getFinalScores()
        

    }, [])

    return (
        <>
            <Header/>

            <div className="main-container">
                <div className ='score'>
                    <table>
                        <tr>
                            <th>Rank</th>
                            <th>Wine Number</th>
                            <th>Average Score</th>
                        </tr>                
                        {
                        finalScores.map((s, index)=>(
                            <tr key = {s.wineNumber}>
                                <td>{index + 1}</td>
                                <td>{s.wineNumber}</td>
                                <td>{s.averageScore}</td>
                            </tr>
                        ))
                        }
                    </table> 
                </div>
                     
            </div>

            <Footer/>
        </>
    )
}