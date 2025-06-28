import axios from "../utils/configAxios.ts";
import type { Permission, Role } from "../store/interfaces/permissionInterfaces.ts";

const mockRoles: Partial<Role>[] = [
    { id: "root", name: "Root", description: "Full access to all features", isSystem: true, usersCount: 0, createdAt: new Date().toISOString() },
    { id: "admin", name: "Admin", description: "Manage content and users", isSystem: true, usersCount: 0, createdAt: new Date().toISOString() },
    { id: "employee", name: "Employee", description: "Manage specific content", isSystem: false, usersCount: 0, createdAt: new Date().toISOString() },
    { id: "user", name: "User", description: "View and comment", isSystem: false, usersCount: 0, createdAt: new Date().toISOString() },
];

const GetAllPermissions = async (searchQuery: string = "") => {
    try {
        const response = await axios.get("/permissions/");
        console.log("Response data:", response.data);
        const permissions = response.data.permissions as Permission[];

        const roles: Role[] = mockRoles.map(mockRole => ({
            ...mockRole,
            permissions: permissions.filter(p => p.role === mockRole.id),
        })) as Role[];

        if (searchQuery) {
            return roles.filter(role =>
                role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                role.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return roles;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        throw error;
    }
};

const UpdatePermission = async (role: string, resource: string, action: string, allowed: boolean) => {
    try {
        console.log("Updating permission:", { role, resource, action, allowed });
        const response = await axios.put("/permissions/", { role, resource, action, allowed });
        return response.data.permission as Permission;
    } catch (error) {
        console.error("Error updating permission:", error);
        throw error;
    }
};

export { GetAllPermissions, UpdatePermission };