"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Users,
  Ban,
  PauseCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CreditCard,
  UserCog,
  X,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type UserStatus =
  | "active"
  | "suspended"
  | "banned";

type UserRole =
  | "user"
  | "support_admin"
  | "content_moderator"
  | "super_admin";

type Plan =
  | "No Plan"
  | "Basic"
  | "Standard"
  | "Premium";

type PlanFilter =
  | "All"
  | "No Plan"
  | "Basic"
  | "Standard"
  | "Premium";

type StatusFilter =
  | "All"
  | "Active"
  | "Suspended"
  | "Banned";

type UpdatePayload =
  | {
      action: "status";
      status: UserStatus;
    }
  | {
      action: "role";
      role: UserRole;
    }
  | {
      action: "plan";
      plan: Plan;
    }
  | {
      action: "subscription";
      subscriptionExpiresAt: string;
    }
  | {
      action: "promo";
      promoAccess: boolean;
    };

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  plan: Plan;
  planId?: string;
  status: UserStatus;
  subscriptionExpiresAt?: string;
  promoAccess?: boolean;
  createdAt?: string;
}

interface UsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

interface UpdateResponse {
  success: boolean;
  message?: string;
}

/* =====================================================
   FILTERS
===================================================== */

const PLAN_FILTERS: PlanFilter[] = [
  "All",
  "No Plan",
  "Basic",
  "Standard",
  "Premium",
];

const STATUS_FILTERS: StatusFilter[] = [
  "All",
  "Active",
  "Suspended",
  "Banned",
];

const ROLE_LABEL: Record<UserRole, string> = {
  user: "User",
  support_admin: "Support Admin",
  content_moderator: "Content Moderator",
  super_admin: "Super Admin",
};

/* =====================================================
   MAIN PAGE
===================================================== */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [search, setSearch] = useState("");

  const [planFilter, setPlanFilter] =
    useState<PlanFilter>("All");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  /* ===================================================
     FETCH USERS
  =================================================== */

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      params.set("plan", planFilter);
      params.set("status", statusFilter);
      params.set("page", String(currentPage));

      const response = await fetch(
        `/api/admin/users?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data =
        (await response.json()) as UsersResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load users"
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );

      setTotalUsers(
        typeof data.total === "number"
          ? data.total
          : 0
      );

      setTotalPages(
        typeof data.totalPages === "number"
          ? Math.max(data.totalPages, 1)
          : 1
      );
    } catch (error) {
      console.error(
        "Failed to fetch users:",
        error
      );

      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    planFilter,
    statusFilter,
    currentPage,
  ]);

  /* ===================================================
     LOAD USERS
  =================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchUsers();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [fetchUsers]);

  /* ===================================================
     UPDATE USER
  =================================================== */

  const updateUser = async (
    userId: string,
    payload: UpdatePayload
  ) => {
    try {
      setActionLoading(true);

      const response = await fetch(
        "/api/admin/users",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            ...payload,
          }),
        }
      );

      const data =
        (await response.json()) as UpdateResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Update failed"
        );
      }

      setSelectedUser(null);

      await fetchUsers();
    } catch (error) {
      console.error(
        "Failed to update user:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* ===================================================
     COUNTS
  =================================================== */

  const activeCount = useMemo(() => {
    return users.filter(
      (user) => user.status === "active"
    ).length;
  }, [users]);

  const suspendedCount = useMemo(() => {
    return users.filter(
      (user) => user.status === "suspended"
    ).length;
  }, [users]);

  const bannedCount = useMemo(() => {
    return users.filter(
      (user) => user.status === "banned"
    ).length;
  }, [users]);

  /* ===================================================
     STYLES
  =================================================== */

  const getStatusStyle = (
    status: UserStatus
  ) => {
    if (status === "active") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }

    if (status === "suspended") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getPlanStyle = (plan: Plan) => {
    if (plan === "Premium") {
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }

    if (plan === "Standard") {
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    }

    if (plan === "Basic") {
      return "text-[#FF4C00] bg-[#FF4C00]/10 border-[#FF4C00]/20";
    }

    return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  };

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <main>
        {/* ===========================================
            HEADER
        =========================================== */}

        <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
          <div className="px-6 md:px-10 py-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users
                    size={18}
                    className="text-[#FF4C00]"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF4C00]">
                    User Management
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Users
                </h1>

                <p className="text-sm text-zinc-500 mt-2">
                  Manage users, accounts, roles and
                  subscriptions.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#111111] border border-[#222222] rounded-xl px-4 py-3">
                <Users
                  size={18}
                  className="text-[#FF4C00]"
                />

                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                    Total Users
                  </p>

                  <p className="text-lg font-black">
                    {totalUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===========================================
            CONTENT
        =========================================== */}

        <div className="p-6 md:p-10">
          {/* =========================================
              STATS
          ========================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<Users size={19} />}
              iconClass="text-[#FF4C00]"
              bgClass="bg-[#FF4C00]/10"
            />

            <StatCard
              title="Active"
              value={activeCount}
              icon={<CheckCircle2 size={19} />}
              iconClass="text-emerald-400"
              bgClass="bg-emerald-500/10"
            />

            <StatCard
              title="Suspended"
              value={suspendedCount}
              icon={<PauseCircle size={19} />}
              iconClass="text-yellow-400"
              bgClass="bg-yellow-500/10"
            />

            <StatCard
              title="Banned"
              value={bannedCount}
              icon={<Ban size={19} />}
              iconClass="text-red-400"
              bgClass="bg-red-500/10"
            />
          </div>

          {/* =========================================
              TABLE CARD
          ========================================= */}

          <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl overflow-hidden">
            {/* FILTER HEADER */}

            <div className="p-5 border-b border-[#1E1E1E]">
              <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
                {/* SEARCH */}

                <div className="relative w-full xl:w-[330px]">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name or email..."
                    className="w-full h-11 bg-[#080808] border border-[#242424] rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#FF4C00]/60"
                  />
                </div>

                {/* PLAN FILTER */}

                <div className="flex gap-2 overflow-x-auto">
                  {PLAN_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        setPlanFilter(filter);
                        setCurrentPage(1);
                      }}
                      className={`px-3.5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                        planFilter === filter
                          ? "bg-[#FF4C00] text-black"
                          : "bg-[#181818] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATUS FILTER */}

              <div className="flex gap-2 mt-4 overflow-x-auto">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setStatusFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold ${
                      statusFilter === filter
                        ? "bg-[#242424] text-white border border-[#333]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* =======================================
                TABLE
            ======================================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-[#1E1E1E]">
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Promo</TableHead>

                    <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING */}

                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-20 text-sm text-zinc-600"
                      >
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    /* EMPTY */
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-20 text-sm text-zinc-600"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    /* USERS */

                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#181818] hover:bg-[#141414]"
                      >
                        {/* USER */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FF4C00]/10 border border-[#FF4C00]/20 flex items-center justify-center text-sm font-black text-[#FF4C00]">
                              {user.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="text-sm font-bold">
                                {user.name}
                              </p>

                              <p className="text-[11px] text-zinc-600 mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PLAN */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${getPlanStyle(
                              user.plan
                            )}`}
                          >
                            {user.plan}
                          </span>
                        </td>

                        {/* ROLE */}

                        <td className="px-6 py-5">
                          <span className="text-xs text-zinc-400">
                            {ROLE_LABEL[user.role] ||
                              "User"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${getStatusStyle(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>

                        {/* JOINED */}

                        <td className="px-6 py-5">
                          <span className="text-xs text-zinc-500">
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        {/* PROMO */}

                        <td className="px-6 py-5">
                          {user.promoAccess ? (
                            <span className="text-xs font-bold text-purple-400">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-600">
                              —
                            </span>
                          )}
                        </td>

                        {/* ACTION */}

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {/* REACTIVATE */}

                            {user.status !==
                              "active" && (
                              <button
                                type="button"
                                onClick={() =>
                                  void updateUser(
                                    user.id,
                                    {
                                      action:
                                        "status",
                                      status:
                                        "active",
                                    }
                                  )
                                }
                                title="Reactivate"
                                disabled={
                                  actionLoading
                                }
                                className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black disabled:opacity-40"
                              >
                                <CheckCircle2
                                  size={16}
                                />
                              </button>
                            )}

                            {/* SUSPEND */}

                            {user.status ===
                              "active" && (
                              <button
                                type="button"
                                onClick={() =>
                                  void updateUser(
                                    user.id,
                                    {
                                      action:
                                        "status",
                                      status:
                                        "suspended",
                                    }
                                  )
                                }
                                title="Suspend"
                                disabled={
                                  actionLoading
                                }
                                className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/10 text-yellow-400 flex items-center justify-center hover:bg-yellow-500 hover:text-black disabled:opacity-40"
                              >
                                <PauseCircle
                                  size={16}
                                />
                              </button>
                            )}

                            {/* MANAGE */}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(
                                  user
                                );
                              }}
                              title="Manage"
                              disabled={actionLoading}
                              className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#252525] text-zinc-400 flex items-center justify-center hover:text-white disabled:opacity-40"
                            >
                              <MoreVertical
                                size={16}
                              />
                            </button>

                            {/* BAN */}

                            {user.status !==
                              "banned" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const confirmed =
                                    window.confirm(
                                      `Ban ${user.name}?`
                                    );

                                  if (
                                    confirmed
                                  ) {
                                    void updateUser(
                                      user.id,
                                      {
                                        action:
                                          "status",
                                        status:
                                          "banned",
                                      }
                                    );
                                  }
                                }}
                                title="Ban"
                                disabled={
                                  actionLoading
                                }
                                className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white disabled:opacity-40"
                              >
                                <Ban size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* =======================================
                PAGINATION
            ======================================= */}

            {users.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E1E1E]">
                <p className="text-xs text-zinc-600">
                  Page{" "}
                  <span className="text-zinc-400 font-bold">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="text-zinc-400 font-bold">
                    {totalPages}
                  </span>
                </p>

                <div className="flex gap-2">
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    className="w-9 h-9 rounded-lg bg-[#181818] border border-[#242424] flex items-center justify-center text-zinc-400 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage >= totalPages
                    }
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                      )
                    }
                    className="w-9 h-9 rounded-lg bg-[#181818] border border-[#242424] flex items-center justify-center text-zinc-400 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===========================================
            MANAGEMENT MODAL
        =========================================== */}

        {selectedUser && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() =>
              setSelectedUser(null)
            }
          >
            <div
              className="w-full max-w-lg bg-[#111111] border border-[#292929] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* MODAL HEADER */}

              <div className="flex items-center justify-between p-6 border-b border-[#242424]">
                <div>
                  <h2 className="text-lg font-black">
                    Manage User
                  </h2>

                  <p className="text-xs text-zinc-500 mt-1">
                    {selectedUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                  className="w-9 h-9 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* =================================
                    ROLE
                ================================= */}

                <div>
                  <label
                    htmlFor="user-role"
                    className="text-xs font-bold text-zinc-500 uppercase"
                  >
                    Role
                  </label>

                  <select
                    id="user-role"
                    value={selectedUser.role}
                    onChange={(event) => {
                      const role =
                        event.target
                          .value as UserRole;

                      setSelectedUser({
                        ...selectedUser,
                        role,
                      });
                    }}
                    className="w-full mt-2 h-11 bg-[#080808] border border-[#292929] rounded-xl px-3 text-sm outline-none"
                  >
                    <option value="user">
                      User
                    </option>

                    <option value="support_admin">
                      Support Admin
                    </option>

                    <option value="content_moderator">
                      Content Moderator
                    </option>

                    <option value="super_admin">
                      Super Admin
                    </option>
                  </select>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      void updateUser(
                        selectedUser.id,
                        {
                          action: "role",
                          role: selectedUser.role,
                        }
                      )
                    }
                    className="mt-2 px-4 py-2 bg-[#181818] border border-[#292929] rounded-lg text-xs font-bold hover:border-[#FF4C00]/50 disabled:opacity-40"
                  >
                    <UserCog
                      size={14}
                      className="inline mr-2"
                    />
                    Update Role
                  </button>
                </div>

                {/* =================================
                    PLAN
                ================================= */}

                <div>
                  <label
                    htmlFor="user-plan"
                    className="text-xs font-bold text-zinc-500 uppercase"
                  >
                    Subscription Plan
                  </label>

                  <select
                    id="user-plan"
                    value={selectedUser.plan}
                    onChange={(event) => {
                      const plan =
                        event.target
                          .value as Plan;

                      setSelectedUser({
                        ...selectedUser,
                        plan,
                      });
                    }}
                    className="w-full mt-2 h-11 bg-[#080808] border border-[#292929] rounded-xl px-3 text-sm outline-none"
                  >
                    <option value="No Plan">
                      No Plan
                    </option>

                    <option value="Basic">
                      Basic
                    </option>

                    <option value="Standard">
                      Standard
                    </option>

                    <option value="Premium">
                      Premium
                    </option>
                  </select>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      void updateUser(
                        selectedUser.id,
                        {
                          action: "plan",
                          plan: selectedUser.plan,
                        }
                      )
                    }
                    className="mt-2 px-4 py-2 bg-[#FF4C00] text-black rounded-lg text-xs font-black disabled:opacity-40"
                  >
                    <CreditCard
                      size={14}
                      className="inline mr-2"
                    />
                    Update Plan
                  </button>
                </div>

                {/* =================================
                    SUBSCRIPTION EXPIRY
                ================================= */}

                <div>
                  <label
                    htmlFor="subscription-expiry"
                    className="text-xs font-bold text-zinc-500 uppercase"
                  >
                    Subscription Expiry
                  </label>

                  <input
                    id="subscription-expiry"
                    type="date"
                    value={
                      selectedUser.subscriptionExpiresAt
                        ? selectedUser.subscriptionExpiresAt.slice(
                            0,
                            10
                          )
                        : ""
                    }
                    onChange={(event) => {
                      setSelectedUser({
                        ...selectedUser,
                        subscriptionExpiresAt:
                          event.target.value,
                      });
                    }}
                    className="w-full mt-2 h-11 bg-[#080808] border border-[#292929] rounded-xl px-3 text-sm text-white outline-none focus:border-[#FF4C00]/60"
                  />

                  <button
                    type="button"
                    disabled={
                      actionLoading ||
                      !selectedUser.subscriptionExpiresAt
                    }
                    onClick={() =>
                      void updateUser(
                        selectedUser.id,
                        {
                          action:
                            "subscription",
                          subscriptionExpiresAt:
                            selectedUser.subscriptionExpiresAt ||
                            "",
                        }
                      )
                    }
                    className="mt-2 px-4 py-2 bg-[#181818] border border-[#292929] rounded-lg text-xs font-bold hover:border-[#FF4C00]/50 disabled:opacity-40"
                  >
                    Extend / Update Validity
                  </button>
                </div>

                {/* =================================
                    PROMO
                ================================= */}

                <div className="flex items-center justify-between p-4 bg-[#181818] rounded-xl border border-[#242424]">
                  <div>
                    <p className="text-sm font-bold">
                      Promo Access
                    </p>

                    <p className="text-xs text-zinc-600 mt-1">
                      Grant temporary promotional
                      access.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() =>
                      void updateUser(
                        selectedUser.id,
                        {
                          action: "promo",
                          promoAccess:
                            !Boolean(
                              selectedUser.promoAccess
                            ),
                        }
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-xs font-black ${
                      selectedUser.promoAccess
                        ? "bg-purple-500 text-white"
                        : "bg-[#252525] text-zinc-300"
                    } disabled:opacity-40`}
                  >
                    {selectedUser.promoAccess
                      ? "Enabled"
                      : "Enable"}
                  </button>
                </div>

                {/* =================================
                    STATUS
                ================================= */}

                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase mb-2">
                    Account Status
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {/* ACTIVE */}

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void updateUser(
                          selectedUser.id,
                          {
                            action: "status",
                            status: "active",
                          }
                        )
                      }
                      className="py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 disabled:opacity-40"
                    >
                      Reactivate
                    </button>

                    {/* SUSPEND */}

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        void updateUser(
                          selectedUser.id,
                          {
                            action: "status",
                            status: "suspended",
                          }
                        )
                      }
                      className="py-3 rounded-xl bg-yellow-500/10 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 disabled:opacity-40"
                    >
                      Suspend
                    </button>

                    {/* BAN */}

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        const confirmed =
                          window.confirm(
                            `Ban ${selectedUser.name}?`
                          );

                        if (confirmed) {
                          void updateUser(
                            selectedUser.id,
                            {
                              action: "status",
                              status: "banned",
                            }
                          );
                        }
                      }}
                      className="py-3 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 disabled:opacity-40"
                    >
                      Ban
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  title,
  value,
  icon,
  iconClass,
  bgClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  bgClass: string;
}) {
  return (
    <div className="bg-[#101010] border border-[#1E1E1E] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-zinc-500">
            {title}
          </p>

          <h2 className="text-2xl font-black mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TABLE HEAD
===================================================== */

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">
      {children}
    </th>
  );
}

/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDate(date?: string) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }
  );
}