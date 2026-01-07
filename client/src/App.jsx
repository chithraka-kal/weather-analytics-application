import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButton';
import Dashboard from './components/Dashboard';
import backgroundImage from './assets/weather-bg.jpg';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading Auth...</div>;

  return (
    <div 
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center" // 1. Added flex items-center justify-center
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      {!isAuthenticated ? (
        <div className="relative z-10 text-center text-white space-y-4 p-8 bg-black/40 rounded-xl backdrop-blur-md border border-white/50 shadow-2xl">
          <h1 className="text-3xl font-semibold drop-shadow-md">Fidenz Weather App</h1>
          <p className="text-lg text-gray-200 drop-shadow-sm">Please log in to view the analytics dashboard.</p>
          
          <div className="pt-4">
            <LoginButton />
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full"> 
          <Dashboard />
        </div>
      )}
    </div>
  );
}

export default App;