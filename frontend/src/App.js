import logo from './logo.svg';
import './App.css';
import api from './api/axiosConfig';
import { useEffect, useState } from 'react';

function App() {

  const [output, setOutput] = useState();

  const setOutputText = async()=> {
    try{
      const response = await api.get('/login');
      setOutput(response.data);
      console.log(response.data)
    }
    catch (error){
      console.log(error);
    }
  }

  useEffect(()=>{
    setOutputText();
  },[])

  return (
    <div className="App">
    </div>
  );
}

export default App;

