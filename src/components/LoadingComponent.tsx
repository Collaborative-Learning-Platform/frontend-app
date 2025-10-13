import { Box } from '@mui/material';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingComponentProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

const LoadingComponent = ({
  size = 'medium',
  message,
  fullPage = false,
}: LoadingComponentProps) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 200, height: 200 };
      case 'medium':
      default:
        return { width: 120, height: 120 };
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...getSizeStyles(),
      }}
    >
      <DotLottieReact
        src="https://lottie.host/a2214a9b-2c00-4084-818b-416b175e1cbe/nm5Wg8dM8D.lottie"
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      {message && (
        <Box
          sx={{
            color: 'text.secondary',
            fontSize: size === 'small' ? '0.8rem' : '1rem',
            textAlign: 'center',
            mt: 1,
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingComponent;
