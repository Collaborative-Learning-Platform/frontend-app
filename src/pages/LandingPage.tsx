import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Toolbar,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Groups,
  PersonalVideo,
  Edit,
  Share,
  Quiz,
  Dashboard,
  Psychology,
  SmartToy,
  ArrowForward,
  CheckCircle,
  Menu,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle, useTheme as useAppTheme } from '../theme';

const LandingPage = () => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Groups />,
      title: 'Workspace & Group Collaboration',
      description: 'Create and join collaborative workspaces with your peers and tutors for seamless group learning.',
    },
    {
      icon: <PersonalVideo />,
      title: 'Personalized Study Plans',
      description: 'Get AI-generated study plans tailored to your learning style and academic goals.',
    },
    {
      icon: <Edit />,
      title: 'Real-Time Document Editing',
      description: 'Collaborate on documents simultaneously with real-time editing and version control.',
    },
    {
      icon: <Share />,
      title: 'Resource Sharing',
      description: 'Share and access study materials, notes, and resources within your learning community.',
    },
    {
      icon: <Quiz />,
      title: 'Interactive Quizzes & Analysis',
      description: 'Take interactive quizzes and get detailed performance analysis to track your progress.',
    },
    {
      icon: <Dashboard />,
      title: 'Visual Dashboards',
      description: 'Monitor your learning progress with intuitive dashboards and analytics.',
    },
    {
      icon: <Psychology />,
      title: 'Flashcards & Gamification',
      description: 'Learn through interactive flashcards with gamification elements to boost engagement.',
    },
    {
      icon: <SmartToy />,
      title: 'AI-Powered Tutor',
      description: 'Get instant help and explanations from our intelligent AI tutor available 24/7.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Join a Workspace',
      description: 'Create or join collaborative learning spaces with your classmates and instructors.',
    },
    {
      number: '02',
      title: 'Collaborate in Groups',
      description: 'Work together on projects, share resources, and learn from each other.',
    },
    {
      number: '03',
      title: 'Achieve Your Goals',
      description: 'Track progress, get insights, and succeed in your academic journey.',
    },
  ];



  return (
    <Box>
      {/* Navigation */}
      <AppBar position="fixed" sx={{ 
        backgroundColor: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.95)' 
          : 'rgba(18, 18, 18, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              color: 'primary.main',
              fontWeight: 700,
              fontSize: '1.5rem'
            }}
          >
            Learni
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* <Button color="inherit" sx={{ color: 'text.primary' }}>Features</Button> */}
              {/* <Button color="inherit" sx={{ color: 'text.primary' }}>How It Works</Button> */}
              {/* <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                component={Link}
                to="/about"
              >
                About
              </Button> */}
              {/* <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                onClick={() => navigate('/theme-demo')}
              >
                Theme Demo
              </Button> */}
              {/* <Button 
                color="inherit" 
                sx={{ color: 'text.primary' }}
                onClick={() => navigate('/quiz')}
              >
                Create Quiz
              </Button> */}
              
              <Button variant="outlined" color="primary" sx={{ ml: 1 }} component={Link} to="/login">
                Login
              </Button>
              <ThemeToggle size="medium" variant='default' />
            </Box>
          )}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeToggle size="small" />
              <IconButton color="inherit" sx={{ color: 'text.primary' }}>
                <Menu />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pt: 12,
          pb: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 300,
              mb: 2,
              background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Learni
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 400,
              mb: 3,
              opacity: 0.9,
            }}
          >
            Collaborate. Learn. Succeed.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.8,
              lineHeight: 1.6,
            }}
          >
            A modern collaborative learning platform designed for university students and tutors.
            Join study groups, share resources, and achieve academic success together.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/about')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Features
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ mb: 2, fontWeight: 300 }}
        >
          Powerful Features for Modern Learning
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
        >
          Discover the tools and features that make Learni the perfect platform
          for collaborative education and academic success.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ 
        backgroundColor: mode === 'light' ? 'grey.50' : 'grey.900', 
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 300 }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
          >
            Get started with Learni in three simple steps and transform your learning experience.
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              },
              gap: 4,
              alignItems: 'center'
            }}
          >
            {steps.map((step, index) => (
              <Box key={index} textAlign="center">
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '4rem',
                    fontWeight: 300,
                    color: 'primary.main',
                    opacity: 0.3,
                    mb: 2,
                  }}
                >
                  {step.number}
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: '280px', mx: 'auto' }}
                >
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ mb: 6, fontWeight: 300 }}
        >
          What Our Users Say
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 4,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                backgroundColor: mode === 'light' ? 'grey.50' : 'grey.800',
              }}
            >
              <Typography
                variant="body1"
                sx={{ mb: 2, fontStyle: 'italic' }}
              >
                "{testimonial.quote}"
              </Typography>
              <Typography variant="subtitle2" color="primary.main">
                {testimonial.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testimonial.role}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container> */}

      {/* Final CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{ mb: 2, fontWeight: 300 }}
          >
            Ready to Transform Your Learning?
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, fontSize: '1.2rem', opacity: 0.9 }}
          >
            Join thousands of students and tutors who are already using Learni
            to achieve their academic goals.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<CheckCircle />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Sign Up Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: 'grey.900',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '2fr 1fr 1fr',
                md: '2fr 1fr 1fr 2fr'
              },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 700 }}
              >
                Learni
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, opacity: 0.8 }}
              >
                Empowering students and tutors with collaborative learning tools
                for academic success.
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Product
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Features
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Pricing
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Security
                </Button>
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  About
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Careers
                </Button>
                <Button color="inherit" size="small" sx={{ justifyContent: 'flex-start', p: 0 }}>
                  Contact
                </Button>
              </Box>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Stay Updated
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                Get the latest updates and features delivered to your inbox.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
              >
                Subscribe
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 4,
              pt: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} Learni. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
