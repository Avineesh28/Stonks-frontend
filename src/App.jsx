import Scrol from './components/Scrol'
import React ,{useState ,useEffect} from 'react'
import './App.css'
import Performance from './components/performance'
import { Portfolio } from './components/Portfolio'
import ProfileCard from './components/ProfileCard';
import Stats from './components/Stats'
import ChartComponentLeftMost from './components/ChartComponentLeftMost'
import { Provider } from './components/Provider'


function App() {

  const [selectedStock, setSelectedStock] = useState(null);

  const handleOnClick = (row) => {
    setSelectedStock(row);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  
  const expansion = (row) => {
    console.log(isExpanded)
    setIsExpanded(!isExpanded); 
    handleOnClick(row);
  };


  return (
    <Provider>
      <div className="tile-container">
        <tile className={`performance ${isExpanded ? 'hidden' : ''}`} id="performance">
          {/* <ChartComponentLeftMost /> */}
          <Performance />
        </tile>
        <tile className={`portfolio ${isExpanded ? 'hidden' : ''}`} id="portfolio">
          <Portfolio />
        </tile>
        <tile className="stocks" id="stocks">
          <Scrol handleOnClick={expansion} />
        </tile>
        <tile className={`logo ${isExpanded ? 'hidden' : ''}`} id="logo">
          <ProfileCard />
        </tile>
        <tile className={`stats ${isExpanded ? 'expanded' : ''}`} id="stats">
          <Stats stock={selectedStock} isExpanded={isExpanded}/>
        </tile>
      </div>
    </Provider>
  )
}

export default App