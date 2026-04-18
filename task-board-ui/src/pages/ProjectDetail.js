import React, { useEffect, useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useApi } from '../hooks/useApi';

const ProjectDetail = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 1 });
  const [commentInput, setCommentInput] = useState({ taskId: null, author: '', body: '' });

  // --- NEW SEARCH & FILTER STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState(""); // Empty means "All"

  // Updated API call to include priority query param
  const fetchTasksCall = useCallback(() => {
    let url = `/tasks?projectId=${id}`;
    if (filterPriority) {
      url += `&priority=${filterPriority}`;
    }
    return api.get(url);
  }, [id, filterPriority]);

  const { data: tasks, loading, error, request: fetchTasks } = useApi(fetchTasksCall);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const moveTask = async (taskId, currentStatus) => {
    try {
      const nextStatus = currentStatus + 1;
      if (nextStatus > 2) return;
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task status.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks?projectId=${id}`, { ...newTask, status: 0 });
      setNewTask({ title: '', description: '', priority: 1 });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      alert("Failed to create task.");
    }
  };

  const handleAddComment = async (taskId) => {
    if (!commentInput.author || !commentInput.body) {
      alert("Please fill in both name and comment.");
      return;
    }
    try {
      await api.post(`/tasks/${taskId}/comments`, {
        author: commentInput.author,
        body: commentInput.body
      });
      setCommentInput({ taskId: null, author: '', body: '' });
      fetchTasks();
    } catch (err) {
      alert("Failed to add comment.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Kanban Board...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">Error: {error}</div>;

  const columns = [
    { label: 'To Do', status: 0, bg: 'bg-gray-100' },
    { label: 'In Progress', status: 1, bg: 'bg-blue-50' },
    { label: 'Done', status: 2, bg: 'bg-green-50' }
  ];

  return (
    <div className="p-8 max-w-full mx-auto bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link to="/" className="text-blue-600 hover:underline font-medium mb-2 inline-block">← Back to Projects</Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Project Workspace</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </header>

      {/* --- SEARCH AND FILTER BAR --- */}
      <div className="mb-8 flex flex-wrap gap-4 items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-grow min-w-[300px]">
          <input 
            type="text"
            placeholder="Search by title or description..."
            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <label className="text-xs font-black uppercase text-gray-400">Filter Priority:</label>
          <select 
            className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreateTask} className="mb-8 bg-white p-6 rounded-2xl shadow-md border border-blue-100 max-w-md animate-in fade-in duration-300">
          <div className="space-y-4">
            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
            <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
            <div className="flex items-center space-x-4">
              <label className="text-sm font-bold text-gray-500">Priority:</label>
              <select className="p-2 border rounded-lg" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: parseInt(e.target.value)})}>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">Add to Board</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col) => (
          <div key={col.status} className={`${col.bg} p-6 rounded-2xl shadow-inner min-h-[600px] border border-gray-200`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 border-b pb-2">{col.label}</h3>
            <div className="space-y-4">
              {tasks?.filter(t => {
                const matchesStatus = t.status === col.status;
                const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
                return matchesStatus && matchesSearch;
              }).map(task => (
                <div key={task.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Comments</p>
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      {task.comments?.map((c, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded text-xs border-l-2 border-blue-400">
                          <span className="font-bold text-blue-600">{c.author}:</span> {c.body}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <input className="w-full text-[10px] border p-1 rounded" placeholder="Your Name" value={commentInput.taskId === task.id ? commentInput.author : ''} onChange={(e) => setCommentInput({taskId: task.id, author: e.target.value, body: commentInput.body})} />
                      <div className="flex gap-1">
                        <input className="flex-grow text-[10px] border p-1 rounded" placeholder="Add a comment..." value={commentInput.taskId === task.id ? commentInput.body : ''} onChange={(e) => setCommentInput({taskId: task.id, author: commentInput.author, body: e.target.value})} />
                        <button onClick={() => handleAddComment(task.id)} className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded hover:bg-blue-600 transition">Post</button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm ${
                        task.priority === 3 ? 'bg-red-500 text-white' : 
                        task.priority === 2 ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority === 3 ? '🔥 High' : task.priority === 2 ? 'Medium' : 'Low'}
                    </span>
                    {task.status < 2 && (
                      <button onClick={() => moveTask(task.id, task.status)} className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">Move Next →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;