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

### Paste & go
```shell
npm run build

node ./pkg/server/dist/src/util/keygen.js

# In first shell
node ./pkg/server/dist/src/server.js server0 3300 .\generated_keys\key0private.pkcs8.pem .\generated_keys\key0public.spki.pem .\generated_keys\neighbourhood.json

# In another shell
node ./pkg/server/dist/src/server.js server1 3300 .\generated_keys\key1private.pkcs8.pem .\generated_keys\key1public.spki.pem .\generated_keys\neighbourhood.json
```
This will create two servers connected in a neighbourhood on ports `3300` and `3301`

## How to navigate the GUI
TODO

## Contributors
Please contact us via this email address if you have any questions or issues:

sp24.feedback@proton.me