import React, {useState} from "react";
import Header from './components/Header/Header'
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Pages/Home/Home";
import SignUp from "./components/Pages/SignUp";
import Login from "./components/Pages/Login";
import AllVideos from "./components/Pages/AllVideos";
import ChangePassword from "./components/Pages/ChangePassword";
import Profile from "./components/Pages/Profile";
import Video from "./components/Pages/Video";
import UploadVideo from "./components/Pages/UploadVideo";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import VideoManage from "./components/Pages/VideoManage";
import AuthLayout from './components/auth/AuthLayout'
import Playlists from "./components/Pages/Playlists/Playlists";

function App() {

  const [query, setQuery] = useState('');

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };


  return (
    <Router>
      <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/change-password" element={<AuthLayout> <ChangePassword /> </AuthLayout> } />
        <Route path="/profile/:username" element={<AuthLayout> <Profile /> </AuthLayout> } />
        <Route path="/videos" element={<AuthLayout> <AllVideos query={query} /> </AuthLayout>} />
        <Route path="/video/:videoId" element={<AuthLayout> <Video/> </AuthLayout>} />
        <Route path="/user-dashboard" element={<AuthLayout> <Dashboard/> </AuthLayout>}/>
        <Route path="/newvideo" element={<AuthLayout> <UploadVideo/> </AuthLayout>}/>
        <Route path='/video-manage/:videoId' element={<AuthLayout> <VideoManage/> </AuthLayout>}/>
        <Route path="/user/playlists" element={<AuthLayout> <Playlists/> </AuthLayout>}/>
      </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
    
    
  )
}

export default App