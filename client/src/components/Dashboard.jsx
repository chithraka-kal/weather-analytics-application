import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { WiCloudy } from 'react-icons/wi';

const Dashboard = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: { audience: "https://weather-api.fidenz" }
                });

                const response = await axios.get('http://localhost:5000/api/weather', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setWeatherData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [getAccessTokenSilently]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-xl text-white font-semibold bg-gray-900">
            Loading Weather Analytics...
        </div>
    );

    return (
        <div>
            <div className="relative z-10">
                <header className="max-w-6xl mx-auto flex justify-between items-center mb-10 text-white">
                    <div>
                        <h1 className="text-3xl font-bold drop-shadow-md">Weather Analytics</h1>
                        <p className="text-gray-200 drop-shadow-md">Real-time comfort ranking</p>
                    </div>
                    <LogoutButton />
                </header>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {weatherData.map((city) => (
                        <div key={city.id} className="relative p-6 bg-white/70 backdrop-blur-md rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            
                            <div className={`absolute top-4 bg-blue-500 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm
                                `}>
                                #{city.rank}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col items-start">
                                    <WiCloudy className="w-16 h-16 -ml-2 drop-shadow-sm text-white/70" />
                                    
                                    <h2 className="text-2xl font-bold text-gray-800">{city.name}</h2>
                                    <span className="text-gray-600 text-sm capitalize font-medium">{city.description}</span>
                                </div>
                                <span className="text-6xl font-bold text-gray-800 tracking-tighter">
                                    {Math.round(city.temp)}°
                                </span>
                            </div>

                            <div className="flex justify-between mt-8 pt-6 border-t border-black/50 text-gray-700">
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="uppercase text-[10px] font-bold tracking-wider text-gray-500">Humidity</span>
                                    <span className="font-bold text-gray-800">{city.humidity}%</span>
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="uppercase text-[10px] font-bold tracking-wider text-gray-500">Wind</span>
                                    <span className="font-bold text-gray-800">{city.windSpeed}m/s</span>
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="uppercase text-[10px] font-bold tracking-wider text-gray-500">Score</span>
                                    <span className={`font-bold text-gray-800`}>
                                        {city.comfortIndex}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;