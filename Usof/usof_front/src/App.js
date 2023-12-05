import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './AppRouter';
import NavBar from "./comps/NavBar";

function App() {
	return (
		<div style={{ background: "#BEE9E8", height: '100vh'  }}>
			<BrowserRouter>
			<NavBar />
    		<AppRouter />
    	</BrowserRouter>
		</div>
    	
  	);
}

export default App;
