"use client";

import React, { useState } from "react";
import {
  Shield,
  Edit3,
  X,
  Check,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useUsers } from "@/features/auth/presentation/hooks/use-auth-queries";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/features/auth/presentation/hooks/use-auth-mutations";
import {
  ROLE_CONFIG,
  type UserRole,
} from "@/features/auth/domain/entities/user-role";
import type { UserAccount } from "@/features/auth/domain/entities/user-account";
import { ADMIN_USERS } from "@/constants/admin/users";

const roles: UserRole[] = ["admin", "cajero", "cocina", "domiciliario"];

export default function AdminUsuariosPage() {
  const { token, currentUser } = useAuth();
  const { data: users = [] } = useUsers(token ?? "");
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {},
  );

  // New user form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("cajero");

  // Edit form
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("cajero");

  const handleAdd = async () => {
    if (!newUsername.trim()) {
      toast.error(ADMIN_USERS.TOAST_USERNAME_REQUIRED);
      return;
    }
    if (!newPassword.trim()) {
      toast.error(ADMIN_USERS.TOAST_PASSWORD_REQUIRED);
      return;
    }
    if (!newDisplayName.trim()) {
      toast.error(ADMIN_USERS.TOAST_DISPLAY_NAME_REQUIRED);
      return;
    }
    if (!token) return;

    try {
      await createUserMutation.mutateAsync({
        data: {
          username: newUsername.trim().toLowerCase(),
          password: newPassword,
          displayName: newDisplayName.trim(),
          role: newRole,
        },
        token,
      });
      setNewUsername("");
      setNewPassword("");
      setNewDisplayName("");
      setNewRole("cajero");
      setShowAddForm(false);
      toast.success(ADMIN_USERS.TOAST_CREATED);
    } catch {
      toast.error(ADMIN_USERS.TOAST_USERNAME_EXISTS);
    }
  };

  const handleStartEdit = (user: UserAccount) => {
    setEditingId(user.id);
    setEditDisplayName(user.displayName);
    setEditPassword("");
    setEditRole(user.role);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editDisplayName.trim()) {
      toast.error(ADMIN_USERS.TOAST_FIELDS_REQUIRED);
      return;
    }
    if (!token) return;

    try {
      const data: Record<string, string> = {
        displayName: editDisplayName.trim(),
        role: editRole,
      };
      if (editPassword.trim()) {
        data.password = editPassword;
      }
      await updateUserMutation.mutateAsync({ id, data, token });
      setEditingId(null);
      toast.success(ADMIN_USERS.TOAST_UPDATED);
    } catch {
      toast.error("Error al actualizar usuario");
    }
  };

  const handleRemove = async (id: string, username: string) => {
    if (currentUser?.username === username) {
      toast.error(ADMIN_USERS.TOAST_CANNOT_DELETE_SELF);
      return;
    }
    if (!token) return;

    try {
      await deleteUserMutation.mutateAsync({ id, token });
      toast.info(ADMIN_USERS.TOAST_DELETED);
    } catch {
      toast.error("No se puede eliminar este usuario");
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-3xl w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-gray-900"
            style={{ fontSize: "28px", fontWeight: 700 }}
          >
            {ADMIN_USERS.TITLE}
          </h1>
          <p className="text-gray-500" style={{ fontSize: "14px" }}>
            {ADMIN_USERS.SUBTITLE}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-sm shadow-orange-200"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {showAddForm ? <X size={18} /> : <UserPlus size={18} />}
          {showAddForm ? ADMIN_USERS.CANCEL_BUTTON : ADMIN_USERS.NEW_USER_BUTTON}
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map((r) => {
          const config = ROLE_CONFIG[r];
          return (
            <div
              key={r}
              className={`p-4 rounded-xl border ${config.bg} border-opacity-50`}
              style={{ borderColor: "transparent" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className={config.color} />
                <span
                  className={config.color}
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  {config.label}
                </span>
              </div>
              <p className="text-gray-600" style={{ fontSize: "12px" }}>
                {config.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add user form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <UserPlus size={20} className="text-orange-600" />
                </div>
                <div>
                  <h2
                    className="text-gray-900"
                    style={{ fontWeight: 600 }}
                  >
                    {ADMIN_USERS.CREATE_FORM_TITLE}
                  </h2>
                  <p
                    className="text-gray-500"
                    style={{ fontSize: "13px" }}
                  >
                    {ADMIN_USERS.CREATE_FORM_SUBTITLE}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-gray-700 mb-1.5"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {ADMIN_USERS.DISPLAY_NAME_LABEL}
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder={ADMIN_USERS.DISPLAY_NAME_PLACEHOLDER}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1.5"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {ADMIN_USERS.USERNAME_LABEL}
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={ADMIN_USERS.USERNAME_PLACEHOLDER}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1.5"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {ADMIN_USERS.PASSWORD_LABEL}
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={ADMIN_USERS.PASSWORD_PLACEHOLDER}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all"
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1.5"
                    style={{ fontSize: "13px", fontWeight: 500 }}
                  >
                    {ADMIN_USERS.ROLE_LABEL}
                  </label>
                  <div className="flex gap-2">
                    {roles.map((r) => {
                      const config = ROLE_CONFIG[r];
                      return (
                        <button
                          key={r}
                          onClick={() => setNewRole(r)}
                          className={`flex-1 px-3 py-2.5 rounded-xl border-2 transition-all ${
                            newRole === r
                              ? `${config.bg} ${config.color} border-current`
                              : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                          }`}
                          style={{ fontSize: "12px", fontWeight: 600 }}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => void handleAdd()}
                disabled={createUserMutation.isPending}
                className="mt-5 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-orange-200"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                <Check size={16} /> {ADMIN_USERS.CREATE_BUTTON}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users list */}
      <div className="space-y-3">
        {users.map((user) => {
          const roleConfig = ROLE_CONFIG[user.role];
          const isEditing = editingId === user.id;
          const isCurrentUser = user.username === currentUser?.username;
          const isMainAdmin = user.username === "admin";

          return (
            <motion.div
              key={user.id}
              layout
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                isCurrentUser
                  ? "border-orange-200 ring-1 ring-orange-100"
                  : "border-gray-100"
              }`}
            >
              {isEditing ? (
                /* Edit mode */
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Edit3 size={16} className="text-orange-500" />
                    <span
                      className="text-gray-900"
                      style={{ fontSize: "14px", fontWeight: 600 }}
                    >
                      {ADMIN_USERS.EDITING_PREFIX} {user.username}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-gray-600 mb-1"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        {ADMIN_USERS.DISPLAY_NAME_LABEL}
                      </label>
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-600 mb-1"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                      >
                        {ADMIN_USERS.PASSWORD_LABEL} (dejar vacio para no cambiar)
                      </label>
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300"
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    {!isMainAdmin && (
                      <div>
                        <label
                          className="block text-gray-600 mb-1"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                        >
                          {ADMIN_USERS.ROLE_LABEL}
                        </label>
                        <div className="flex gap-2">
                          {roles.map((r) => {
                            const config = ROLE_CONFIG[r];
                            return (
                              <button
                                key={r}
                                onClick={() => setEditRole(r)}
                                className={`flex-1 px-2 py-2 rounded-xl border-2 transition-all ${
                                  editRole === r
                                    ? `${config.bg} ${config.color} border-current`
                                    : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                                }`}
                                style={{ fontSize: "11px", fontWeight: 600 }}
                              >
                                {config.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => void handleSaveEdit(user.id)}
                      disabled={updateUserMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl transition-all"
                      style={{ fontSize: "13px", fontWeight: 600 }}
                    >
                      <Check size={14} /> {ADMIN_USERS.SAVE_BUTTON}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1.5 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                      style={{ fontSize: "13px" }}
                    >
                      <X size={14} /> {ADMIN_USERS.CANCEL_BUTTON}
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${roleConfig.bg}`}
                    >
                      <Shield size={18} className={roleConfig.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p
                          className="text-gray-900"
                          style={{ fontWeight: 600, fontSize: "15px" }}
                        >
                          {user.displayName}
                        </p>
                        {isCurrentUser && (
                          <span
                            className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full"
                            style={{ fontSize: "10px", fontWeight: 600 }}
                          >
                            {ADMIN_USERS.YOU_BADGE}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-gray-400"
                          style={{ fontSize: "13px" }}
                        >
                          @{user.username}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${roleConfig.bg} ${roleConfig.color}`}
                          style={{ fontSize: "11px", fontWeight: 600 }}
                        >
                          {roleConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(user)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    {!isMainAdmin && !isCurrentUser && (
                      <button
                        onClick={() =>
                          void handleRemove(user.id, user.username)
                        }
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
