import React, { useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApi } from '../hooks/useApi';
import { ThemeContext } from '../context/ThemeContext';

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  // 1. Memoize the API call function using useCallback.
  // This prevents the function from being re-created on every render,
  // which is what stops the infinite loop in your terminal.
  const fetchProjectsCall = useCallback(() => api.get('/projects'), []);

  // 2. Pass the memoized function into your custom hook
  const { data: projects, loading, error, request: fetchProjects } = useApi(fetchProjectsCall);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 text-lg font-medium">Loading Projects...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg m-6 border border-red-200">
      <p className="font-bold text-xl">Connection Error</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">TaskBoard</h1>
            <p className="opacity-60 mt-1 text-sm">Manage your projects and productivity</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            title="Toggle Theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project) => (
            <Link to={`/project/${project.id}`} key={project.id} className="group no-underline">
              <div className="bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-xl transition-all duration-300 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">{project.name}</h2>
                <p className="text-sm opacity-70 mb-8 flex-grow leading-relaxed">{project.description}</p>
                
                <div className="flex justify-between items-center pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">{project.todoCount}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Todo</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-yellow-500">{project.inProgressCount}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Active</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-green-500">{project.doneCount}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Done</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {projects?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl opacity-50">No projects found. Try seeding your database!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;