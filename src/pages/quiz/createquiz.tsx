import {Box,Container,useTheme,Typography} from '@mui/material';


const CreateQuiz = () => {
  const theme = useTheme();
  // const isMobile = theme.breakpoints.down('sm');

  return (
    <Container sx={{
      marginTop:'20px'
    }} >
      <Box>
        <Typography variant='h1'>
          Create Quiz
        </Typography>
      </Box>
      <Box height={'50vh'} sx={{
        margin: '10rem',
        background:theme.palette.secondary.dark
      }}>
          Quiz details
      </Box>
      <Box height={'50vh'} sx={{
        background: theme.palette.primary.main,
        color: theme.palette.common.white,
      }}>
          Add Question 
      </Box>
    </Container>
  )
}

export default CreateQuiz