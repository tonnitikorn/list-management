// import { useState } from 'react'
// import './App.css'
// import "antd/dist/reset.css"; 
// import "./index.css"; 

// import LayoutFrom from './components/Layout'
// import RegisterForm from './components/RegisterForm'
// // import RegisterForm from './Register'
// import SignInForm from './components/SignInForm'
// import Main from './components/Main'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <div >
//       {/* <RegisterForm/> */}
//       {/* <LayoutFrom></LayoutFrom> */}
//       {/* <Header/> */}
//       <RegisterForm />
//       {/* <SignInForm /> */}
//       {/* <Main/> */}
//     </div>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import SignIn from "./SignIn";
import Home from "./Home";
import "antd/dist/reset.css"; 
import "./index.css"; 
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/main" element={<Home />} /> {/* หน้า MainPage */}
      </Routes>
    </Router>
  );
};

export default App;

