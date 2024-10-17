# Secure Programming Implmementation

University of Adelaide Semester 2 2024.

## Please DO NOT put personally identifiable information from this project into ChatGPT, for example, university name, ID number, email addresses, or GitHub usernames. If using ChatGPT for security analysis, please thoroughly check your prompt for personal and or sensitive information before submission.

## What is this
Assignment for COMP SCI 3307 Secure Programming at the University of Adelaide.
Students were tasked to design and implement a secure chat protocol.

The protocol was standardised by the whole class. You can read it at https://github.com/xvk-64/2024-secure-programming-protocol

Part of the assignment was to plant artificial backdoors and vulnerabilities, so the
code contained in this repository may be vulnerable. Please open it at your own risk, and in a secure, sandboxed environment. 

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

## Advanced Testing
For testing with networked neighbourhood, you need a definition of the other neighbourhood servers. You can generate this by running
```shell
node ./pkg/server/dist/src/util/keygen.js [numKeys] [outDir]
```
- The default number of key pairs (servers in neighbourhood) is 3
- The default output directory is `generated_keys` in the current directory
- The keys will be named `key[Number][private|public].[format].pem`
- The generated neighbourhood file will have server `i` with key `key[i]....pem` using port `3300 + i`
  - For example, server 2 (the third server) has public key `key2public.spki.pem` and uses port `3302`

Run an instance of a server in the neighbourhood using
```shell
node ./pkg/server/dist/src/server.js [address] [port] [private key file] [public key file] [neighbourhood.json file]
```

Add additional servers by modifying the `neighbourhood.json` file.

### Paste & Go Advanced Testing
```shell
# Run these commands once
npm run build

node ./pkg/server/dist/src/util/keygen.js

# Open two shells:

# In first shell
node ./pkg/server/dist/src/server.js server0 3300 ./generated_keys/key0private.pkcs8.pem ./generated_keys/key0public.spki.pem ./generated_keys/neighbourhood.json

# In another shell
node ./pkg/server/dist/src/server.js server1 3301 .\generated_keys\key1private.pkcs8.pem .\generated_keys\key1public.spki.pem .\generated_keys\neighbourhood.json
```
This will create two servers connected in a neighbourhood on ports `3300` and `3301`. Start up a client and ensure you change the default server address accordingly. 

## How to navigate the GUI

# Initial Setup:

You will be prompted with a screen to enter the address of a server to connect to. 
 

# Main GUI
Once you successfully connect, you will have access to the main GUI.

At the top of the screen, you will see your assigned fingerprint.

Below is "Group selection", which will show you all your created groups. By default, you will see "Global", which is where you can send public messages to all connected clients.

Below this is a list of all currently connected clients. If you are the only connected client to a server, you will see the server's client in the list of clients. 

To create a private chat, select the users from the global list that you want to include, and press the'Create Private Chat' button.
This will create a new Private Chat which will appear beside the "Global" button. Members of the chat will automatically have this chat appear on their client. 

Group Private Chats:
- Will have its own unique identifier unique to each client. 
- Once a chat with multiple members is created, you cannot see the members of the chat unless they message the group. 

1:1 Private Chat
- Chat identifier will be the other user's fingerprint


## Contributors
Valen Kostich
James Fitton-Gum
Mia Klaric