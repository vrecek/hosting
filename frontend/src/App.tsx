import '@/css/index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home/Home'
import LayoutNavigation from './components/Layout/LayoutNavigation/LayoutNavigation'
import Collection from './components/Collection/Collection'
import Credentials from './components/Account/Credentials/Credentials'


function App() {
   return (
      <>
         <BrowserRouter>

            <LayoutNavigation />

            <Routes>

               <Route path='/' element={<Home />} />
               <Route path='/collection' element={<Collection />} />
               <Route path='/account/*' element={<Credentials />} />
               <Route path='/account' element={<h1>acc</h1>} />

            </Routes>

         </BrowserRouter>
      </>
   )
}


export default App
