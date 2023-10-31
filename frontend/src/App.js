import './App.css';
import {Link} from "react-router-dom";

function App() {

  return (
    <div className="App">
        <h1> Senta Voting System </h1>
        <div className="button-container">
            <Link to={"/login"}>
                <button className="button" style={{marginRight:'50px'}}> Login </button>
            </Link>
            <Link to={"/signup"}>
                <button className="button" > Register </button>
            </Link>
        </div>
    </div>
    );
}

export default App;

