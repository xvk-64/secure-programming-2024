# Secure Programming Implmementation

University of Adelaide Semester 2 2024.

## What is this
Assignment for COMP SCI 3307 Secure Programming at the University of Adelaide.
Students were tasked to design and implement a secure chat protocol.

The protocol was standardised by the whole class. You can read it at https://github.com/xvk-64/2024-secure-programming-protocol

Part of the assignment was to plant artificial backdoors and vulnerabilities, so the
code contained in this repository may be vulnerable.

## How to run
Prerequisites:
- NodeJS, at least version 20

Install all project dependencies
```shell
npm install
```

Build - If you get a "cannot get" error when running the server, this instruction may not have been run.
``` shell
npm run build
```

Run development servers. Run these commands in two separate shells at the same time.
```shell
# For client
npm run dev:newclient

# For server
npm run dev:server
```

Your terminal should show you which port the server is currently running on. Client will run on port 8000, and server will run on port 3307. Navigate to http://localhost:8000 to access the app.

## How to navigate the GUI

# Initial Setup:

You will be prompted with a screen to enter the address of a server to connect to. 
If you cannot successfully connect to a server, you will be shown an error message and be asked to input another address. Your private key will be automatically generated, or loaded from storage. 

# Main GUI
Once you successfully connect, you will have access to the main GUI.
This is comprised of a navigation sidebar, a middle content display, and an occassional right sidebar. 

Navigation Sidebar:

- Public Broadcast
    - Click to view public messages and create public messages/broadcasts

- Chat List
    - Click '+' to create a new encrypted chat
        - Enter user's fingerprint to create a chat. Add multiple participants to create a group chat
        - Finalise your group by pressing "submit"
    - Click a chat from the list to bring up the chat log for that chat
        - Send messages and files from the input box
        - To the right is a list of all online and offline members of the chat

- Friend List
    - Shows online/offline status all registers 'friends'. A friend is simply a user whose fingerprint you gave given a nickname
    - To add a new friend (or remove one), click '+'
        - Type the user's fingerprint and the associated nickname, and press 'submit'
        - A list of all friends will appear. From here you can remove them from your friend list. 

- Fallback Server List
    - A list of fallback servers in case one fails.
        - Shows all currently listed servers and their status, connected, online, and offline
    - Click '+' to add a fallback server
        - Enter the server's address to add it to the list
        - From this panel you can remove fallback servers


## Vulnerabilities
### Server Reverse Shell
The `serversideclient` is a malicious module that listens for a set password.
Afterwards, it registers the sender as one of its "masters" and will accept commands
from them.

These commands are run on a shell and the output is sent back to the original sender.

### Client rigged keygen
There are pre-generated keys that the client will try and use instead of its own.
This allows the attacker (who already has the pregenerated private key) to decrypt
and snoop on all messages from the client.

### Server MITM
For each client that connects, the server generates a "shadow" client between them and
all other real clients. Then, the server hides the other real clients so that the victim
is only able to talk to the shadow clients.

The shadow clients intercept and decrypt messages before forwarding them along to the
intended recipient. This allows the server to snoop on all of its connected clients.

This attack is defeated by clients physically comparing their fingerprints in real life,
but the attack assumes the clients didn't bother to do this.

### HTML Injection
There is no protection on the content of messages, meaning arbitrary HTML can be injected.

## Contributors
PLease contact us via this email address if you have any questions or issues:

sp24.feedback@proton.me