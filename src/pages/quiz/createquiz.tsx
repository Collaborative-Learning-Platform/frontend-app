import {Box,Container,useTheme,Typography} from '@mui/material';


const CreateQuiz = () => {
  const theme = useTheme();
  // const isMobile = theme.breakpoints.down('sm');

  return (
    <Container sx={{
      marginTop:'10px'
    }} >
      {/* Create quiz top bar */}
      <Box display={'flex'}>
        <Box>
          <Typography variant='h1'>
            Create Quiz
          </Typography>
          <Typography variant='h6'>
            Design assessments for your students
          </Typography>
        </Box>
        <Box>
          
        </Box>

      </Box>
      <Box>
        <Typography variant='body1' sx={{marginTop: '20px'}}>
          This page is under construction. Please check back later.
        </Typography>
      </Box>
      <Box>
        <Typography variant='body1' sx={{marginTop: '20px'}}>
          Add question
        </Typography>
      </Box>

    </Container>
  )
}

export default CreateQuiz