import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import { HashRouter } from 'react-router-dom'
import News from "../views/news/News";
import Detail from "../views/news/Detail";

export default function indexRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<News />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="*" element={localStorage.getItem('token') ? 
        <NewsSandBox></NewsSandBox> : 
//         <Navigate to="/login" />
        <Route index element={<Login />}/>
        } />
      </Routes>
    </HashRouter>
  );
}
