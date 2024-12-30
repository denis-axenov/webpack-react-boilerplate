import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router";
import App from "./App";
import Page from "./Page";
import "./styles/main.scss";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const basename =
    process.env.NODE_ENV === "production" ? "/webpack-react-boilerplate" : "/";

root.render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/page" element={<Page/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);