import {registerRoot} from 'remotion';
import {Composition} from 'remotion';
import {ClaudeShowreel} from './ClaudeShowreel';
import {LogoTransition, Test} from './Composition';

const App = () => (
  <>
    <Composition
      id="ClaudeShowreel"
      component={ClaudeShowreel}
      durationInFrames={900}
      fps={60}
      width={1920}
      height={1080}
    />
    <Composition
      id="LogoTransition"
      component={LogoTransition}
      durationInFrames={240}
      fps={24}
      width={1080}
      height={1080}
    />
    <Composition
      id="Test"
      component={Test}
      durationInFrames={90}
      fps={30}
      width={1280}
      height={720}
    />
  </>
);

registerRoot(App);