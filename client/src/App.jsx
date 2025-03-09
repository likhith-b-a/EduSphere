import ReactDOM from "react-dom/client";
// import './App.css'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx';
import Verify from "./pages/Auth/Verify.jsx";
import Home from "./pages/Landing/Home.jsx";
import About from "./pages/Landing/About.jsx";
import Courses from "./pages/Landing/Courses.jsx";
import UserProfile from "./pages/Profile/Profile.jsx";
import Header from "./components/Header/header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Loader from "./components/Loader/Loader.jsx";

import { UserData } from "./Context/UserContext.jsx";
import CourseDescription from "./pages/Course/CourseDescription.jsx";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess.jsx";
import MyLearning from "./pages/My Learning/MyLearning.jsx";
import Lectures from "./pages/Lectures/Lectures.jsx";
import AddCourse from "./Admin/AddCourse.jsx";
import Users from "./Admin/Users.jsx";
import Forget from "./pages/Auth/Forget.jsx";
import Reset from "./pages/Auth/Reset.jsx";



function App() {

  const { isAuth, user, loading } = UserData();
  return (
    <>
      {loading ?
        <Loader /> :
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            <Route path="/login" element={isAuth ? <Home /> : <Login />} ></Route>
            <Route path="/register" element={isAuth ? <Home /> : <Register />} ></Route>
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} ></Route>

            <Route path="/" element={<Home />} ></Route>
            <Route path="/about" element={<About />} ></Route>
            <Route path="/courses" element={<Courses />} ></Route>
            <Route path="/profile" element={<UserProfile user={user} />} ></Route>

            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescription user={user} /> : <Login />}
            />

            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
            />

            <Route
              path="/mylearning"
              element={<MyLearning />}
            />

            <Route
              path="/course/study/:id"
              element={isAuth ? <Lectures /> : <Login />}
            />

            <Route
              path="/addCourse"
              element={user?.role === "admin" ? <AddCourse user={user} /> : <Home />}
            />
            <Route
              path="/users"
              element={user?.role === "admin" ? <Users user={user} /> : <Home />}
            />

            <Route
              path="/forgot"
              element={isAuth ? <Home /> : <Forget />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <Reset />}
            />

          </Routes>
          <Footer />
        </BrowserRouter>
      }
    </>
  )
}

export default App
