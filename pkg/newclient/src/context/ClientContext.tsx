import React, {createContext, MutableRefObject, useRef} from "react";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";

export type ClientContextType = MutableRefObject<{
    client: ChatClient;
    serverAddress: string;
} | undefined> | undefined;
export const ClientContext = createContext<ClientContextType>(undefined);