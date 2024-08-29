import React from "react";
import {hello} from "@sp24/common"

export const App : React.FC = () => (
    <p>
        Hello, world!<br/>
        {hello()}
    </p>
);