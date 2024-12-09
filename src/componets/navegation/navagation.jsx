import React from "react";
import '../App.css'; 
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Home} from "../../screens/home";
import Gestación from "../../screens/Gestacion";

export default function Navigation() {
    return (
      <Router>

            <Routes>
         

               <Route exact path="/">
                 <Home />
              </Route> 
              <Route exact path="/Gestación">
                  <Gestación />
              </Route> 

          
  
          </Routes>
         
      </Router>
    );
  }
  