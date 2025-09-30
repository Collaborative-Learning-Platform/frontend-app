import { Box, Typography } from "@mui/material";
import GroupCard from "../components/workpsaces/GroupCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { gridTemplateColumnsStyles } from "../styles/pages/workspace";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/Authcontext";

interface Group {
  groupId: string;
  name: string;
  description: string;
  type: "Main" | "Custom";
  createdAt: string;
  memberCount?: number;
}

//This page is for students to view all groups in a workspace
const WorkspacePage = () => {
  const { workspaceId, workspaceName } = useParams<{ workspaceId: string, workspaceName: string }>();
  const navigate = useNavigate();
  const { user_id } = useAuth();

  const [mainGroups, setMainGroups] = useState<Group[]>([]);
  const [otherGroups, setOtherGroups] = useState<Group[]>([]);
  

  useEffect(() => {
    const fetchWorkspace = async (userId: string, workspaceId: string) => {
      try {
        const response = await axiosInstance.post(`/workspace/groups/fetchByUserId`, {
          userId,
          workspaceId,
        });

        console.log("Fetched workspace data:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          const groups: Group[] = response.data.data;

          // Split groups by type
          setMainGroups(groups.filter((g) => g.type === "Main"));
          setOtherGroups(groups.filter((g) => g.type === "Custom"));

          
          
        }
      } catch (error) {
        console.error("Error fetching workspace data:", error);
      }
    };

    if (workspaceId && user_id) fetchWorkspace(user_id, workspaceId);
  }, [workspaceId, user_id]);

  const handleClick = (groupId: string | number) => {
    navigate(`/workspace/${workspaceId}/group/${groupId}`);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        {workspaceName}
      </Typography>

      {/* Main groups */}
      <Box mb={4}>
        <Typography variant="h6" mb={1}>
          Main groups
        </Typography>
        <Box display="grid" gap={2} sx={gridTemplateColumnsStyles}>
          {mainGroups.map((group) => (
            <GroupCard
              key={group.groupId}
              id={group.groupId}
              name={group.name}
              memberCount={group.memberCount}
              type="main"
              onClick={handleClick}
              footerSlot={
                <Typography variant="caption" color="text.secondary">
                  {group.description || "No description"}
                </Typography>
              }
            />
          ))}
        </Box>
      </Box>

      {/* Other groups */}
      <Box>
        <Typography variant="h6" mb={1}>
          Other groups
        </Typography>
        <Box display="grid" gap={2} sx={gridTemplateColumnsStyles}>
          {otherGroups.map((group) => (
            <GroupCard
              key={group.groupId}
              id={group.groupId}
              name={group.name}
              memberCount={group.memberCount}
              type="other"
              onClick={handleClick}
              footerSlot={
                <Typography variant="caption" color="text.secondary">
                  {group.description || "No description"}
                </Typography>
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspacePage;
