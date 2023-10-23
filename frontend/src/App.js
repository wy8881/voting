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

// function App() {
//   return (
//       <div className="App">
//         <header className="App-header">
//           <p>
//             Movies list
//           </p>
//         </header>
//         {
//           movies.map(movie => {
//             return (
//                 <div className="movie-box">
//                   <div className="movie-box-header">
//                   </div>
//                   <div className="movie-box-body">
//                     <img alt={movie.name} className="movie-image" src={movie.img} />
//                   </div>
//                   <div className="movie-box-footer">
//                     {movie.name}
//                     <div className="like-button"><i class="fa fa-heart" style={{"color": "red"}}aria-hidden="true"></i></div>
//                   </div>
//                 </div>
//             )
//           })
//         }
//       </div>
//   );
// }
