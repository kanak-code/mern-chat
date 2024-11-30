import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.jsx' 

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
      <App />
    </ChakraProvider>
)
