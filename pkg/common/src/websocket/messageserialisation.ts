import {
    AnyMessage,
    ClientList, ClientListRequest,
    ClientUpdate, ClientUpdateRequest,
    MessageTypes, SignedData
} from "../messageTypes.js";

export async function deserialiseMessage(message: string) : Promise<AnyMessage | undefined> {
    const parsed = JSON.parse(message);

    // Assert message type
    if (typeof parsed.type != "string") return;
    if (!MessageTypes.includes(parsed.type)) return;

    switch (parsed.type) {
        case "signed_data":
            // Assert fields
            if (typeof parsed.counter != "number") return;
            if (typeof parsed.signature != "string") return;

            // Assert data
            if (typeof parsed.data != "string") return;

            return SignedData.fromProtocol(parsed);
        case "client_list_request":
            return new ClientListRequest();
        case "client_update":
            if (! (parsed.clients instanceof Array)) return;

            return await ClientUpdate.fromProtocol(parsed);
        case "client_list":
            if (! (parsed.servers instanceof Array)) return;
            if (parsed.servers.length != 0) {
                if (typeof parsed.servers[0].address != "string") return;
                if (! (parsed.servers[0].clients instanceof Array)) return;
            }

            return await ClientList.fromProtocol(parsed);
        case "client_update_request":
            return new ClientUpdateRequest();
    }
}