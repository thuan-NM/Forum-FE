import { Icon } from '@iconify/react';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-content2 p-4 hidden md:block bg-content1">
            <nav className="flex flex-col gap-1">
                <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} end>
                    <Icon icon="lucide:home" />
                    <span>Dashboard</span>
                </NavLink>

                <div className="mt-6 mb-2 px-3">
                    <p className="text-xs font-medium text-default-500 uppercase tracking-wider">Content</p>
                </div>
                <NavLink to="/posts" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:file-text" />
                    <span>Posts</span>
                </NavLink>
                <NavLink to="/questions" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:help-circle" />
                    <span>Questions</span>
                </NavLink>
                <NavLink to="/answers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:message-circle" />
                    <span>Answers</span>
                </NavLink>
                <NavLink to="/comments" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:message-square" />
                    <span>Comments</span>
                </NavLink>
                <NavLink to="/topics" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:tag" />
                    <span>Topics</span>
                </NavLink>
                <NavLink to="/tags" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:hash" />
                    <span>Tags</span>
                </NavLink>

                <div className="mt-6 mb-2 px-3">
                    <p className="text-xs font-medium text-default-500 uppercase tracking-wider">Users</p>
                </div>
                <NavLink to="/users" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:users" />
                    <span>Users</span>
                </NavLink>
                <NavLink to="/permissions" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:shield" />
                    <span>Permissions</span>
                </NavLink>

                <div className="mt-6 mb-2 px-3">
                    <p className="text-xs font-medium text-default-500 uppercase tracking-wider">Monitoring</p>
                </div>
                <NavLink to="/reports" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:flag" />
                    <span>Reports</span>
                </NavLink>
                <NavLink to="/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:bell" />
                    <span>Notifications</span>
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:bar-chart-2" />
                    <span>Analytics</span>
                </NavLink>

                <div className="mt-6 mb-2 px-3">
                    <p className="text-xs font-medium text-default-500 uppercase tracking-wider">System</p>
                </div>
                <NavLink to="/file-manager" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:folder" />
                    <span>File Manager</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                    <Icon icon="lucide:settings" />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;