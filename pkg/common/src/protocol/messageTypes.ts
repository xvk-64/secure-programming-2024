namespace Protocol {
    export type HelloData = {
        type: "hello";
        public_key: string;
    }
    export type ChatData = {
        type: "chat";
        destination_servers: string[];
        iv: string;
        symm_keys: string[];
        chat: string;
    }
    export type Chat = {
        participants: string[];
        message: string;
    }
    export type PublicChatData = {
        type: "public_chat";
        sender: string;
        message: string;
    }
    export type ServerHelloData = {
        type: "server_hello";
        sender: string;
    }
    export type SignedData = {
        type: "signed_data";
        data: HelloData | ChatData | PublicChatData | ServerHelloData;
        counter: number;
        signature: string;
    }

    export type ClientListRequest = {
        type: "client_list_request";
    }

    export type ClientList = {
        type: "client_list";
        servers: {
            address: string;
            clients: string[];
        }[];
    }

    export type ClientUpdate = {
        type: "client_update";
        clients: string[];
    }

    export type ClientUpdateRequest = {
        type: "client_update_request";
    }

}