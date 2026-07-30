import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WellnessProvider } from "./contexts/WellnessContext";
import Home from "./pages/Home";
import Modules from "@/pages/Modules";
import Growth from "@/pages/Growth";
import EventDetail from "@/pages/EventDetail";
import EmotionAwareness from "@/pages/modules/EmotionAwareness";
import CognitiveRegulation from "@/pages/modules/CognitiveRegulation";
import CommunicationScript from "@/pages/modules/CommunicationScript";
import DecisionGuidance from "@/pages/modules/DecisionGuidance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/modules" component={Modules} />
      {/* 支援帶事件 ID 的模組路由 */}
      <Route path="/modules/emotion-awareness">
        <EmotionAwareness />
      </Route>
      <Route path="/modules/emotion-awareness/:eventId">
        {(params) => <EmotionAwareness eventId={params.eventId as string} />}
      </Route>
      <Route path="/modules/cognitive-regulation">
        <CognitiveRegulation />
      </Route>
      <Route path="/modules/cognitive-regulation/:eventId">
        {(params) => <CognitiveRegulation eventId={params.eventId as string} />}
      </Route>
      <Route path="/modules/communication-script">
        <CommunicationScript />
      </Route>
      <Route path="/modules/communication-script/:eventId">
        {(params) => <CommunicationScript eventId={params.eventId as string} />}
      </Route>
      <Route path="/modules/decision-guidance">
        <DecisionGuidance />
      </Route>
      <Route path="/modules/decision-guidance/:eventId">
        {(params) => <DecisionGuidance eventId={params.eventId as string} />}
      </Route>
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
