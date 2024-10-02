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

Run development server
```shell
npm run dev
```

## Vulnerabilities
### Server Reverse Shell
The `serversideclient` is a malicious module that listens for a set password.
Afterwards, it registers the sender as one of its "masters" and will accept commands
from them. 

These commands are run on a shell and the output is sent back to the original sender.

### Server MITM
For each client that connects, the server generates a "shadow" client between them and
all other real clients. Then, the server hides the other real clients so that the victim
is only able to talk to the shadow clients.

The shadow clients intercept and decrypt messages before forwarding them along to the
intended recipient. This allows the server to snoop on all of its connected clients.

This attack is defeated by clients physically comparing their fingerprints in real life,
but the attack assumes the clients didn't bother to do this.