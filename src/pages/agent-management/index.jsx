import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AgentCard from './components/AgentCard';
import AgentTable from './components/AgentTable';
import AddAgentModal from './components/AddAgentModal';
import EditAgentModal from './components/EditAgentModal';
import PerformanceModal from './components/PerformanceModal';
import PermissionsModal from './components/PermissionsModal';
import TeamStats from './components/TeamStats';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AgentManagement = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [userRole] = useState('admin'); // Mock user role
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock agents data
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Mohammad Rahman",
      email: "mohammad.rahman@bdticketpro.com",
      phone: "+880 1712-345678",
      role: "admin",
      joinDate: "15/03/2023",
      totalBookings: 245,
      salesAmount: 2450000,
      status: "active"
    },
    {
      id: 2,
      name: "Fatima Khan",
      email: "fatima.khan@bdticketpro.com",
      phone: "+880 1798-765432",
      role: "manager",
      joinDate: "22/05/2023",
      totalBookings: 189,
      salesAmount: 1890000,
      status: "active"
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@bdticketpro.com",
      phone: "+880 1634-567890",
      role: "staff",
      joinDate: "10/08/2023",
      totalBookings: 156,
      salesAmount: 1560000,
      status: "active"
    },
    {
      id: 4,
      name: "Rashida Begum",
      email: "rashida.begum@bdticketpro.com",
      phone: "+880 1555-123456",
      role: "staff",
      joinDate: "05/11/2023",
      totalBookings: 134,
      salesAmount: 1340000,
      status: "active"
    },
    {
      id: 5,
      name: "Karim Ahmed",
      email: "karim.ahmed@bdticketpro.com",
      phone: "+880 1777-987654",
      role: "manager",
      joinDate: "18/01/2024",
      totalBookings: 98,
      salesAmount: 980000,
      status: "inactive"
    },
    {
      id: 6,
      name: "Nasreen Ali",
      email: "nasreen.ali@bdticketpro.com",
      phone: "+880 1666-456789",
      role: "staff",
      joinDate: "12/12/2023",
      totalBookings: 87,
      salesAmount: 870000,
      status: "active"
    }
  ]);

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || agent.role === roleFilter;
    const matchesStatus = !statusFilter || agent.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Modal handlers
  const handleAddAgent = () => {
    setShowAddModal(true);
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setShowEditModal(true);
  };

  const handleViewPerformance = (agent) => {
    setSelectedAgent(agent);
    setShowPerformanceModal(true);
  };

  const handleManagePermissions = (agent) => {
    setSelectedAgent(agent);
    setShowPermissionsModal(true);
  };

  const handleSaveAgent = (newAgent) => {
    setAgents(prev => [...prev, newAgent]);
  };

  const handleUpdateAgent = (updatedAgent) => {
    setAgents(prev => prev.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ));
  };

  const handleSavePermissions = (updatedAgent) => {
    setAgents(prev => prev.map(agent => 
      agent.id === updatedAgent.id ? updatedAgent : agent
    ));
  };

  // Close modals
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowPerformanceModal(false);
    setShowPermissionsModal(false);
    setSelectedAgent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isExpanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        userRole={userRole}
      />
      
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-280' : 'lg:ml-16'}`}>
        <Header 
          onSidebarToggle={() => setSidebarExpanded(!sidebarExpanded)}
          title="Agent Management"
        />
        
        <main className="p-6">
          <Breadcrumb />
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
              >
                <div>
                  <h1 className="font-heading font-semibold text-2xl text-foreground">
                    Agent Management
                  </h1>
                  <p className="text-muted-foreground font-caption mt-1">
                    Manage your travel agency team members and their permissions
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    iconName="Table"
                  />
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    iconName="Grid3X3"
                  />
                </div>
              </motion.div>

              {/* Filter Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FilterControls
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  onAddAgent={handleAddAgent}
                  userRole={userRole}
                />
              </motion.div>

              {/* Agents List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {viewMode === 'table' ? (
                  <AgentTable
                    agents={filteredAgents}
                    onEdit={handleEditAgent}
                    onViewPerformance={handleViewPerformance}
                    onManagePermissions={handleManagePermissions}
                    userRole={userRole}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAgents.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        onEdit={handleEditAgent}
                        onViewPerformance={handleViewPerformance}
                        onManagePermissions={handleManagePermissions}
                        userRole={userRole}
                      />
                    ))}
                  </div>
                )}
                
                {filteredAgents.length === 0 && (
                  <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Icon name="Users" size={48} color="var(--color-muted-foreground)" />
                    <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
                      No agents found
                    </h3>
                    <p className="text-muted-foreground font-caption mt-2">
                      Try adjusting your search criteria or add a new agent.
                    </p>
                    {userRole === 'admin' && (
                      <Button
                        onClick={handleAddAgent}
                        iconName="Plus"
                        iconPosition="left"
                        className="mt-4"
                      >
                        Add New Agent
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="xl:col-span-1"
            >
              <TeamStats agents={agents} />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddAgentModal
        isOpen={showAddModal}
        onClose={closeModals}
        onSave={handleSaveAgent}
      />
      
      <EditAgentModal
        isOpen={showEditModal}
        onClose={closeModals}
        onSave={handleUpdateAgent}
        agent={selectedAgent}
        userRole={userRole}
      />
      
      <PerformanceModal
        isOpen={showPerformanceModal}
        onClose={closeModals}
        agent={selectedAgent}
      />
      
      <PermissionsModal
        isOpen={showPermissionsModal}
        onClose={closeModals}
        onSave={handleSavePermissions}
        agent={selectedAgent}
      />
    </div>
  );
};

export default AgentManagement;