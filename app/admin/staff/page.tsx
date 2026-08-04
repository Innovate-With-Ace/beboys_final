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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Shield, Trash, Users } from "lucide-react";

// --- MOCK DATA (Remove when integrating backend) ---
const mockStaffData: StaffMember[] = [
  {
    id: "1",
    name: "Juan Dela Cruz",
    email: "juan@beboys.com",
    role: "Admin",
    status: "Active",
    avatarUrl: "https://i.pravatar.cc/150?u=juan",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@beboys.com",
    role: "Staff",
    status: "Active",
  },
  {
    id: "3",
    name: null, // Pending users might not have set up their name yet
    email: "newguy@beboys.com",
    role: "Staff",
    status: "Pending",
  },
];
// ---------------------------------------------------

export default function StaffManagementPage() {
  // --- UI STATES ---
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffData);
  const [isLoading, setIsLoading] = useState(false); // Toggle this to see the skeleton
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  // --- CALLBACKS ---
  const handleInvite = (email: string, role: StaffRole) => {
    console.log("Inviting user:", { email, role });
    // TODO: Wire up actual invite API call here
  };

  const handleChangeRole = (staffId: string, newRole: StaffRole) => {
    console.log("Changing role for user", staffId, "to", newRole);
    // TODO: Wire up actual role change API call here
  };

  const handleRemove = (staffId: string) => {
    console.log("Removing user:", staffId);
    // TODO: Wire up actual delete API call here
  };

  // --- HELPER ---
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
      {/* HEADER */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage menu items, recipes, and real-time availability.
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      {/* TABLE / CONTENT */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // LOADING SKELETON STATE
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[60px] rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[70px] rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : staff.length === 0 ? (
              // EMPTY STATE
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
              // POPULATED STATE
              staff.map((member) => (
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Dynamic Role Change Button */}
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeRole(
                              member.id,
                              member.role === "Admin" ? "Staff" : "Admin",
                            )
                          }
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make {member.role === "Admin" ? "Staff" : "Admin"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleRemove(member.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove User
                        </DropdownMenuItem>
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
      />
    </div>
  );
}
