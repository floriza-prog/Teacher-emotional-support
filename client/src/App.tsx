import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WellnessProvider } from "./contexts/WellnessContext";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import Growth from "./pages/Growth";
import EventDetail from "./pages/EventDetail";
import EmotionAwareness from "./pages/modules/EmotionAwareness";
import CognitiveRegulation from "./pages/modules/CognitiveRegulation";
import CommunicationScript from "./pages/modules/CommunicationScript";
import DecisionGuidance from "./pages/modules/DecisionGuidance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/modules" component={Modules} />
      <Route path="/modules/emotion-awareness" component={EmotionAwareness} />
      <Route path="/modules/cognitive-regulation" component={CognitiveRegulation} />
      <Route path="/modules/communication-script" component={CommunicationScript} />
      <Route path="/modules/decision-guidance" component={DecisionGuidance} />
      <Route path="/growth" component={Growth} />
      <Route path="/event/:id">
        {(params) => <EventDetail id={params.id as string} />}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WellnessProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WellnessProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
