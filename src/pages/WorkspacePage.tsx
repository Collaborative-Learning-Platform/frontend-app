import { Box, Typography } from '@mui/material'
import GroupCard from '../components/workpsaces/GroupCard'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { gridTemplateColumnsStyles } from '../styles/pages/workspace';

const mockWorkspace = {
    name:'CS3040 - Software Engineering',
    mainGroups: [
        { id: 1, name: 'CSE 3040 - CSE group' },
        { id: 2, name: 'CSE 3040 - ENTC group' },
    ],
    otherGroups: [
        { id: 3, name: 'Study Group - mid exam' },
        { id: 4, name: 'Study Group - Viva' },
    ]
}

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch workspace data based on the ID
  }, [workspaceId]);


    const handleClick = (groupId: number | string) => {
        navigate(`/workspace/${workspaceId}/group/${groupId}`);
    };


  return (
        <Box>
            <Typography variant="h4" mb={3}>{mockWorkspace.name}</Typography>

                    <Box mb={4}>
                        <Typography variant="h6" mb={1}>Main groups</Typography>
                                <Box
                                    display="grid"
                                    gap={2}
                                    sx={gridTemplateColumnsStyles}
                                >
                                    {mockWorkspace.mainGroups.map(group => (
                                        <GroupCard key={group.id} id={group.id} name={group.name} type="main" onClick={handleClick} />
                                    ))}
                                </Box>
                    </Box>

                    <Box>
                        <Typography variant="h6" mb={1}>Other groups</Typography>
                                <Box
                                    display="grid"
                                    gap={2}
                                    sx={gridTemplateColumnsStyles}
                                >
                                    {mockWorkspace.otherGroups.map(group => (
                                        <GroupCard key={group.id} id={group.id} name={group.name} type="other" onClick={handleClick} />
                                    ))}
                                </Box>
                    </Box>
        </Box>
  )
}

export default WorkspacePage