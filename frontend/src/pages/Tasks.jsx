import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';

const Tasks = () => {
  const { showNotification } = useNotification();

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, 'in-progress': 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);

      const response = await API.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to fetch tasks',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await API.get('/tasks/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [statusFilter, priorityFilter]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Open create modal
  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    });
    setFormErrors({});
    setIsEditing(false);
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setFormErrors({});
    setIsEditing(true);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setActionLoading('submit');
    try {
      if (isEditing) {
        await API.put(`/tasks/${currentTask._id}`, formData);
        showNotification('Task updated successfully!', 'success');
      } else {
        await API.post('/tasks', formData);
        showNotification('Task created successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to save task',
        'error'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete
  const handleDelete = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    setActionLoading(taskToDelete._id);
    try {
      await API.delete(`/tasks/${taskToDelete._id}`);
      showNotification('Task deleted successfully!', 'success');
      fetchTasks();
      fetchStats();
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to delete task',
        'error'
      );
    } finally {
      setActionLoading(null);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  // Quick status update
  const handleStatusChange = async (taskId, newStatus) => {
    setActionLoading(taskId);
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      showNotification('Status updated!', 'success');
      fetchTasks();
      fetchStats();
    } catch (error) {
      showNotification('Failed to update status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Priority badge colors
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  // Status badge colors
  const statusColors = {
    pending: 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats['in-progress']}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first task</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() =>
                          handleStatusChange(
                            task._id,
                            task.status === 'completed' ? 'pending' : 'completed'
                          )
                        }
                        disabled={actionLoading === task._id}
                        className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            task.status === 'completed'
                              ? 'text-gray-400 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              statusColors[task.status]
                            }`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={actionLoading === task._id}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      disabled={actionLoading === task._id}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      {actionLoading === task._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.title
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="Enter task title"
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.description
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-primary-500'
                    }`}
                    placeholder="Enter task description (optional)"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'submit'}
                    className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading === 'submit' ? (
                      <>
                        <Spinner size="sm" />
                        <span>Saving...</span>
                      </>
                    ) : isEditing ? (
                      'Update Task'
                    ) : (
                      'Create Task'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};

export default Tasks;
