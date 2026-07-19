import { useNavigationStore } from './store/navigationStore.ts';
import { GlobalProvider } from './providers/GlobalProvider.tsx';
import { LayoutWrapper } from './layouts/LayoutWrapper.tsx';

// Page Views
import { LandingPage } from './components/pages/LandingPage.tsx';
import { LoginPage } from './components/pages/LoginPage.tsx';
import { SandboxPage } from './components/pages/SandboxPage.tsx';

export default function App() {
  const { currentScreen } = useNavigationStore();

  return (
    <GlobalProvider>
      <LayoutWrapper>
        {currentScreen === 'landing' && <LandingPage />}
        {currentScreen === 'login' && <LoginPage />}
        {currentScreen !== 'landing' && currentScreen !== 'login' && <SandboxPage />}
      </LayoutWrapper>
    </GlobalProvider>
  );
}
