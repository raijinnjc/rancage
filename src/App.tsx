import { useNavigationStore } from './store/navigationStore.ts';
import { GlobalProvider } from './providers/GlobalProvider.tsx';
import { LayoutWrapper } from './layouts/LayoutWrapper.tsx';
import { PageTransition } from './components/ui/PageTransition.tsx';

// Page Views
import { LandingPage } from './components/pages/LandingPage.tsx';
import { LoginPage } from './components/pages/LoginPage.tsx';
import { ExplorationPage } from './components/pages/ExplorationPage.tsx';
import { MethodologyPage } from './components/pages/MethodologyPage.tsx';
import GovernancePage from './components/pages/GovernancePage.tsx';
import HouseholdTargetingPage from './components/pages/HouseholdTargetingPage.tsx';
import MlEvaluationPage from './components/pages/MlEvaluationPage.tsx';
import PolicyRecommendationPage from './components/pages/PolicyRecommendationPage.tsx';
import MonitoringCenterPage from './components/pages/MonitoringCenterPage.tsx';

export default function App() {
  const { currentScreen } = useNavigationStore();

  return (
    <GlobalProvider>
      <LayoutWrapper>
        <PageTransition pageKey={currentScreen}>
          {/* Public Routes */}
          {currentScreen === 'landing' && <LandingPage />}
          {currentScreen === 'exploration' && <ExplorationPage />}
          {currentScreen === 'methodology' && <MethodologyPage />}
          {currentScreen === 'login' && <LoginPage />}
          
          {/* Private / Government Routes */}
          {currentScreen === 'dashboard' && <GovernancePage />}
          {currentScreen === 'household' && <HouseholdTargetingPage />}
          {currentScreen === 'ml-evaluation' && <MlEvaluationPage />}
          {currentScreen === 'recommendation' && <PolicyRecommendationPage />}
          {currentScreen === 'monitoring' && <MonitoringCenterPage />}
        </PageTransition>
      </LayoutWrapper>
    </GlobalProvider>
  );
}
