import React from 'react';
import ReactDOM from 'react-dom';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import './index.scss';
import App from './components/App';
import {TransactionListeUseRouter} from './components/transactions/transactionListeUseRouter';
//import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
{

    path: '/',
    element: <App />,
    errorElement: <div>404 Not Found </div>
},
{
    path: '/transactions',
    element: <TransactionListeUseRouter/>

}

]);

ReactDOM.render(
  <React.StrictMode>

    <RouterProvider router={router}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
