'use client';

import { useState } from 'react';
import { Button, Input, Modal, Select, Table, useToast } from '@/app/ui/components';
import { TUser } from '@/utils/types';
import { updateUser, deleteUser } from '@/app/actions/users';

export const UserManagement = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const { showToast } = useToast();

  const handleEdit = (user: TUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(users.filter(user => user.id !== userId));
      showToast('User deleted successfully', 'success');
    } else {
      showToast(result.errors?.[0] || 'Failed to delete user', 'error');
    }
  };

  const handleUpdate = async (data: Partial<TUser>) => {
    if (!selectedUser) return;
    
    const result = await updateUser(selectedUser.id, data);
    if (result.success) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...data } : user
      ));
      setIsModalOpen(false);
      showToast('User updated successfully', 'success');
    } else {
      showToast(result.errors?.[0] || 'Failed to update user', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <Table
        data={users}
        columns={[
          { header: 'Email', accessor: 'email' },
          { header: 'Name', accessor: 'firstName' },
          { header: 'Role', accessor: 'role' },
          {
            header: 'Actions',
            accessor: 'actions',
            cell: (user: TUser) => (
              <div className="space-x-2">
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button onClick={() => handleDelete(user.id)} variant="secondary">Delete</Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        {selectedUser && (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdate({
              email: formData.get('email') as string,
              firstName: formData.get('firstName') as string,
              lastName: formData.get('lastName') as string,
              role: formData.get('role') as 'user' | 'admin',
            });
          }}>
            <div className="space-y-4">
              <Input
                name="email"
                label="Email"
                defaultValue={selectedUser.email}
                required
                type="email"
              />
              <Input
                name="firstName"
                label="First Name"
                defaultValue={selectedUser.firstName}
                required
                type="text"
              />
              <Input
                name="lastName"
                label="Last Name"
                defaultValue={selectedUser.lastName}
                required
                type="text"
              />
              <Select
                name="role"
                label="Role"
                defaultValue={selectedUser.role}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
                required
              />
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}; 