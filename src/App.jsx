import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import RoastInput from "./components/RoastInput/RoastInput";
import WallOfShame from "./components/WallOfShame/WallOfShame";
import Footer from "./components/Footer/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <RoastInput />
        <WallOfShame />
      </main>
      <Footer />
    </div>
  );
}

export default App;
