import React, {FormEvent, useContext, useState} from "react";
import {ClientContext} from "../../context/ClientContext.js";

export type UserPickerProps = {
    onlineUsers: string[];
    onGroup: (groupID: string) => void;
}

export function UserPicker(props: UserPickerProps) {
    const [pickedUsers, setPickedUsers] = useState<string[]>([]);

    const clientContext = useContext(ClientContext);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const groupID = clientContext?.current?.client.getGroupID(pickedUsers);

        if (groupID !== undefined)
            props.onGroup(groupID);

        setPickedUsers([]);
    }

    return <>
        <form onSubmit={onSubmit}>
            {props.onlineUsers.map(user =>
                <p key={user}>
                    <input type="checkbox"
                           checked={pickedUsers.includes(user)}
                           onChange={e => setPickedUsers(pickedUsers.includes(user) ? pickedUsers.filter(u => u !== user) : [...pickedUsers, user])}
                    /><span>{user}</span>
                </p>
            )}
            <input type="submit" value="Create Private Chat"/>
        </form>
    </>
}