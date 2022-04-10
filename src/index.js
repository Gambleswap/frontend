import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.js';
import reportWebVitals from './reportWebVitals';
import {App} from "./App"



ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// ReactDOM.render(
//   <React.StrictMode>
//       <div className="App">
//           <Gambling />
//       </div>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
//
// ReactDOM.render(
//   <React.StrictMode>
//       <div >
//           <Header />
//       </div>
//   </React.StrictMode>,
//   document.getElementById('head')
// );
//
// ReactDOM.render(
//   <React.StrictMode>
//     <History />
//   </React.StrictMode>,
//   document.getElementById('history')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

