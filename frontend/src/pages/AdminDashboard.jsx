import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import API, { invalidateApiCache } from '../api/axios';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminDashboard = () => {
  const { showNotification } = useNotification();

  // Users state
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalAction, setModalAction] = useState(null);

  // Fetch users
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/admin/users?page=${page}&limit=${usersPerPage}`);
      setUsers(response.data.users || response.data);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || response.data.length) / usersPerPage));
      setCurrentPage(page);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to fetch users',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle activate/deactivate
  const handleStatusChange = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);
    setModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser || !modalAction) return;

    setActionLoading(selectedUser._id);
    try {
      const endpoint = modalAction === 'activate' 
        ? `/admin/users/${selectedUser._id}/activate`
        : `/admin/users/${selectedUser._id}/deactivate`;
      
      await API.put(endpoint);
      
      // Invalidate cached user list
      invalidateApiCache('/admin/users');
      
      // Update user in local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? { ...u, isActive: modalAction === 'activate' }
            : u
        )
      );
      
      showNotification(
        `User ${modalAction === 'activate' ? 'activated' : 'deactivated'} successfully!`,
        'success'
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || `Failed to ${modalAction} user`,
        'error'
      );
    } finally {
      setActionLoading(null);
      setModalOpen(false);
      setSelectedUser(null);
      setModalAction(null);
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchUsers(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchUsers(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden sm:inline">Total Users:</span>
            <span className="font-semibold text-primary-600">{users.length}</span>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-semibold">
                                {(user.fullName || user.name)?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {user.fullName || user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {user.role !== 'admin' && (
                            <div className="flex justify-end gap-2">
                              {user.isActive ? (
                                <button
                                  onClick={() => handleStatusChange(user, 'deactivate')}
                                  disabled={actionLoading === user._id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                  {actionLoading === user._id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    'Deactivate'
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(user, 'activate')}
                                  disabled={actionLoading === user._id}
                                  className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                                >
                                  {actionLoading === user._id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    'Activate'
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user._id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {(user.fullName || user.name)?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.fullName || user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user.role !== 'admin' && (
                        <div>
                          {user.isActive ? (
                            <button
                              onClick={() => handleStatusChange(user, 'deactivate')}
                              disabled={actionLoading === user._id}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user._id ? (
                                <Spinner size="sm" />
                              ) : (
                                'Deactivate'
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user, 'activate')}
                              disabled={actionLoading === user._id}
                              className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === user._id ? (
                                <Spinner size="sm" />
                              ) : (
                                'Activate'
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {users.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-500">No users found.</p>
                </div>
              )}

              {/* Pagination */}
              {users.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
          setModalAction(null);
        }}
        onConfirm={confirmStatusChange}
        title={modalAction === 'deactivate' ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${modalAction} ${selectedUser?.fullName || selectedUser?.name}? ${
          modalAction === 'deactivate'
            ? 'They will no longer be able to access the system.'
            : 'They will regain access to the system.'
        }`}
        confirmText={modalAction === 'deactivate' ? 'Deactivate' : 'Activate'}
        isLoading={actionLoading === selectedUser?._id}
      />
    </div>
  );
};

export default AdminDashboard;
