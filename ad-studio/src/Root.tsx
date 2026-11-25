import React from 'react';
import { Composition, Still } from 'remotion';
import { TuftlyCommercial } from './TuftlyCommercial';
import { TuftlyStatusLuxe } from './TuftlyStatusLuxe';
import { TuftlyStatusPop } from './TuftlyStatusPop';
import { POSTER_SPECS, TuftlyStatusPoster } from './TuftlyStatusPosters';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TuftlyCommercial"
        component={TuftlyCommercial}
        durationInFrames={1365}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TuftlyStatusLuxe"
        component={TuftlyStatusLuxe}
        durationInFrames={1365}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TuftlyStatusPop"
        component={TuftlyStatusPop}
        durationInFrames={1254}
        fps={30}
        width={1080}
        height={1920}
      />
      {POSTER_SPECS.map((spec) => (
        <Still
          key={spec.id}
          id={spec.id}
          component={() => <TuftlyStatusPoster spec={spec} />}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
