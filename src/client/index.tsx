import React from 'react';
import ReactDOM from 'react-dom';
import {App} from "./App.js";
import {createRoot} from "react-dom/client";

const container = document.getElementById('root');
const root = createRoot(container!);

// esbuild live reload
new EventSource('/esbuild').addEventListener('change', () => location.reload())

root.render(<App/>)
