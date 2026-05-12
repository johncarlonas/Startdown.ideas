import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import RoastInput from "./components/RoastInput/RoastInput";
import WallOfShame from "./components/WallOfShame/WallOfShame";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  const [wallRefreshKey, setWallRefreshKey] = useState(0);

  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <RoastInput onShareSuccess={() => setWallRefreshKey((k) => k + 1)} />
        <WallOfShame refreshKey={wallRefreshKey} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
