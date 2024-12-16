import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import WineRating from './pages/WineRating.jsx'
import ChooseAvatar from "./pages/ChooseAvatar.jsx"
import WaitingRoom from "./pages/WaitingRoom.jsx"
import NotFound from './pages/NotFound.jsx'
import ScoreCalculations from './pages/ScoreCalculations.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<App/>}/>
        <Route path = "/:roomId/choose-avatar" element={<ChooseAvatar/>}/>
        <Route path = "/:roomId/waiting-room" element={<WaitingRoom/>}/>
        <Route path = "/:roomId/wine-rating" element={<WineRating/>}/>
        <Route path = "/:roomId/score-calculation" element={<ScoreCalculations/>}/>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
