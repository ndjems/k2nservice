import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';



const Dashboard = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
    
        <Header toggleSidebar={() => console.log('Sidebar toggled')} />
        <Navbar />
        <main className="flex-1 p-8">
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard!</p>
          </div>
        </main>

        <Footer />
  </div>
  );
}

export default Dashboard;




/** 
  return (
    <div className="min-h-screen w-full flex flex-col">
 
      <Header />


        <main className="flex-1 p-8">
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to the dashboard!</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
*/