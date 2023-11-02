import React from "react";
import "./App.css";
import Audio from "./features/audio/Audio";
import { Counter } from "./features/counter/Counter";
import { HelpWrapper } from "./features/tips/useHelp";
import logo from "./logo.svg";

const appWrappers = [HelpWrapper];

const AppWrapper = ({
  wrappers,
  children,
}: React.PropsWithChildren<{ wrappers: React.FC<React.PropsWithChildren>[] }>) => {
  return wrappers.reverse().reduce<React.ReactNode>((accum, Wrapper) => {
    return <Wrapper>{accum}</Wrapper>;
  }, children);
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AppWrapper wrappers={appWrappers}>
          <img src={logo} className="App-logo" alt="logo" />
          <Audio />
          <Counter />
          <p>
            Edit <code>src/App.tsx</code> and save to baz.
          </p>
          <span>
            <span>Learn </span>
            <a className="App-link" href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
              React
            </a>
            <span>, </span>
            <a className="App-link" href="https://redux.js.org/" target="_blank" rel="noopener noreferrer">
              Redux
            </a>
            <span>, </span>
            <a className="App-link" href="https://redux-toolkit.js.org/" target="_blank" rel="noopener noreferrer">
              Redux Toolkit
            </a>
            ,<span> and </span>
            <a className="App-link" href="https://react-redux.js.org/" target="_blank" rel="noopener noreferrer">
              React Redux
            </a>
          </span>
        </AppWrapper>
      </header>
    </div>
  );
}

export default App;
