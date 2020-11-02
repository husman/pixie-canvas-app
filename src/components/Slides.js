import React from 'react';
import { Impress, Step } from '@neetos/pixie-impress';
import '@neetos/pixie-impress/es/index.css';

function Slides() {
  return (
    <Impress
      progress={true}
      fallbackMessage={<p>Sorry, your <b>device or browser</b> couldn't support well.</p>}
    >
      <Step
        data={{
          x: 0,
        }}
      >
        <h1>Title 1</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Enim neque volutpat ac tincidunt vitae semper quis lectus.
        </p>
      </Step>
      <Step
        data={{
          x: 1300,
        }}
      >
        <h1>Title 2</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Enim neque volutpat ac tincidunt vitae semper quis lectus.
        </p>
      </Step>
      <Step
        data={{
          x: 1300 * 2,
        }}
      >
        <h1>Title 3</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Enim neque volutpat ac tincidunt vitae semper quis lectus.
        </p>
      </Step>
    </Impress>
  );
}

export default Slides;
