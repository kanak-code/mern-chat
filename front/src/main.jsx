import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.jsx'
import ChatProvider from './Context/ChatProvider';
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ChakraProvider>,
)
