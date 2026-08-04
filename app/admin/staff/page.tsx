"use client";

import { useState } from "react";
import { StaffMember, StaffRole } from "@/types/Staff";
import { InviteStaffDialog } from "@/components/staff/invite-staff-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Shield,
  Trash,
  Users,
  AlertCircle,
} from "lucide-react";
import fetchApi from "@/lib/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function StaffManagementPage() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: staffData,
    isLoading: staffIsLoading,
    isError: staffIsError,
  } = useQuery<StaffMember[]>({
    queryKey: ["staffs"],
    queryFn: async () => {
      const response = await fetchApi<StaffMember[]>("/api/staff", {
        method: "GET",
      });
      return response;
    },
  });

  const createStaff = useMutation({
    mutationFn: async (user: { email: string; role: StaffRole }) =>
      fetchApi("/api/staff", { method: "POST", body: JSON.stringify(user) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      setIsInviteDialogOpen(false);
      toast.success("User invited successfully");
    },
    onError: () => {
      toast.error("Failed to invite user. Please try again.");
    },
  });

  const updateStaff = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: StaffRole }) =>
      fetchApi(`/api/staff/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user. Please try again.");
    },
  });

  const deleteStaff = useMutation({
    mutationFn: async ({
      id,
      mode,
    }: {
      id: string;
      mode: "delete" | "revoke";
    }) =>
      fetchApi(`/api/staff/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ mode }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      toast.success("User deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete user. Please try again.");
    },
  });

  const handleInvite = async (email: string, role: StaffRole) => {
    try {
      await createStaff.mutateAsync({ email, role });
    } catch (error) {}
  };

  const handleChangeRole = async (staffId: string, newRole: StaffRole) => {
    try {
      await updateStaff.mutateAsync({ id: staffId, role: newRole });
    } catch (error) {}
  };

  const handleRemove = async (
    invitationID: string,
    mode: "delete" | "revoke",
  ) => {
    try {
      await deleteStaff.mutateAsync({ id: invitationID, mode });
    } catch (error) {}
  };

  const getInitials = (name: string | null, email: string) => {
    if (!name) return email.substring(0, 2).toUpperCase();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your team members and their access levels.
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffIsLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-37.5" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-15 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-17.5 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : staffIsError ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold">
                        Failed to load staff
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Could not retrieve team members at this time.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        queryClient.invalidateQueries({ queryKey: ["staffs"] })
                      }
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : !staffData || staffData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold">
                        No staff members yet
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You haven&apos;t added anyone to your team.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsInviteDialogOpen(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Invite your first team
                      member
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              staffData.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={member.avatarUrl}
                          alt={member.name || member.email}
                        />
                        <AvatarFallback>
                          {getInitials(member.name, member.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {member.name || (
                            <span className="text-muted-foreground italic">
                              Invited User
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "Admin" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {member.role === "Admin" && (
                        <Shield className="mr-1 h-3 w-3" />
                      )}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "Active" ? "outline" : "secondary"
                      }
                      className={
                        member.status === "Active"
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {member.userID && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleChangeRole(
                                  member.userID,
                                  member.role === "Admin" ? "Staff" : "Admin",
                                )
                              }
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make {member.role === "Admin" ? "Staff" : "Admin"}
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() =>
                              handleRemove(
                                member.userID ? member.userID : member.id,
                                member.userID ? "delete" : "revoke",
                              )
                            }
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {member.userID
                              ? "Remove User"
                              : "Revoke Invitation"}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InviteStaffDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInvite={handleInvite}
        isPending={createStaff.isPending}
      />
    </div>
  );
}
