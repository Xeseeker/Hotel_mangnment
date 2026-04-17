import React, { useState, useEffect } from "react";
import Skeleton from "../../components/ui/Skeleton";
import StatusPill from "../../components/luxury/StatusPill";
import { userService } from "../../services/userService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="page-wrap">
        <Skeleton className="mb-8 h-12 w-48 rounded-luxury" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-luxury" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-hero mb-10">
        <div className="relative z-10 max-w-3xl">
          <p className="section-kicker">Directory</p>
          <h1 className="heading-lg mt-4 text-white">Manage users</h1>
          <p className="mt-3 text-white/75">View all registered users.</p>
        </div>
      </div>

      <div className="table-shell">
        <div className="overflow-x-auto px-2 pb-2 sm:px-4 sm:pb-3">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-cream-100 to-cream-50">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Role</th>
                <th className="table-header-cell">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-100/80">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors duration-300 hover:bg-cream-50/80"
                >
                  <td className="table-body-cell font-medium text-elysium-ink">
                    {user.name}
                  </td>
                  <td className="table-body-cell">{user.email}</td>
                  <td className="table-body-cell">
                    <StatusPill status={user.role} domain="role" />
                  </td>
                  <td className="table-body-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
