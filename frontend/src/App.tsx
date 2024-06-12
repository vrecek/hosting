import '@/css/index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import LayoutNavigation from './components/Layout/LayoutNavigation/LayoutNavigation'


function App() {
   return (
      <>
         <BrowserRouter>

            <LayoutNavigation />

            <Routes>

               <Route path='/' element={<Home />} />

            </Routes>

         </BrowserRouter>
      </>
   )
}


export default App
