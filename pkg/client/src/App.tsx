import React, {useEffect, useState} from "react";
import "./App.css";
import {ChatWrapper} from "./ChatWrapper.js";
import { UserProvider } from "./UserContext.js";
import { ChatProvider } from "./ChatContext.js";

export const App : React.FC = () => {
    // dev example preloaded user
    useEffect(() => {
        localStorage.setItem("privKey", "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwRbEZUUy9TkXMp4TYMr4uBAqEi/Cg2YMvpwQ4ngKsMnyZXWvnAn5BOgmGFHaF8+ShiCW/X7XYHlOSn+B/OROmQ5voiRZK5bQOUjqyp77mHZu1ho3hUxoLjgVg5+3dIk3d+BKW/Ag3RXfpkk5VIYO+hqz6MkodFg9DCHgDme/XeRe+m0rQeIR4KlRgElrQIsvQ+uKR6oLreub/18BJs1hlqq2KPyfcUTbMP0Eq8xYEHeq6QumQAJrBejEhfZSkDWrpW0RqXI1YZB9a2kjkTvRgo7t6915I2+2BTtbJukNDFRwycKro++ttKJmpbivUctDpugpTma//vu8pmwQhsZG1AgMBAAECggEAU5UgNiyOMj9gqnuOasOY2RHyeMowVdz9rwVHY59NDiC8Yy5goT/V5RDjfi/KyZaNxShdGcME407x+tcTaNAEKLTrQxZpuybzO00zZw5SXyQP9sGwGfVBJtR3aW1gJRiEiql8CxrDvI2Un+zPdt927EtIzzQ0X1lb8EGeQrrl9qm5W0IQUrJZ87zj/Fg11YFj75EWhpgQ20LQdJXE7+outE3SbgmCC3qgJOZ6DNaNMMQHZFZP2qwcOUSqWkpvaihjFqXcnTcUPsaLJ4Z0/8SPLbcFpC08fsUC/j28/w3pESQKF/ZhguQuPlwV72zj35QjaEI1DDMKZBa2kRKRrNND6wKBgQD3JiqBRkyu5FFGDmCzWGvIRE/EuOfSNpAGmRJhYbHLdFSpkhZVXgaruaN+DOGckFiwnfn7PCmDziAQV30c8d+++r3IQS5PS4zSmE1+S2rV4Gov2hOZsG2MCnnnLWyGfa+XXob58CZHkmgib7l0DqZSccQWYA4SKg0dZi3gE0pJFwKBgQC2lbwsK9HpQeOpF738KBjNtM3Dzgp1h8vql7pB6kyihKXQqg0mbjBImqqQ902ytkL6kVltDYRMcOEn+iJUAyjavoa4o7cWmG+I2O11w7psRgnDF+Jwsgn4PPU6G8d9a6Fblp01vM15nz77hgQWqpvzo3b2LScqbXIqzSzFbFAjEwKBgGq9AP5z7gpacP9glkLenS4Q0qKTeQtApVM0KMwF9VN5Gldh0GNuCFOCCSoXRhjn/mXI1H28rfFOxGpKXq5xh8BjajNicy2r41XQkSdKSwmzsiiYdn6Zw7YHkD5XT9eF0J//Iywum1mt0WuN9Po6mXphx94h/fG6V4+q4YU0z5BhAoGAKU4SdcOsByLax+QRHLxNcCvY6NTx1MjVvsp4XnUMxS9Q+7Wcp/cBgUtMDuODdkx5NoovOtZ1+X0H0q1pmqvkUCgN/jM7NidiBAlfHucag2gMyU/b8Da2vqu7plumc58nr7qQ8hk2Oq9l5izZO+94vFNclDB+zcBYtYoY+MiaEHUCgYB8ujsrBMjY6L7eMNIxac2MLZlbJoITr3q7N2KAW3KtPmaWfcr8ULSZ+C8lxFlEMe5RoCzTZxeQMsqLPmbJqmMqu2TSDJp15kF4wDlw800Ob1iWioR0zgwCBvHWR4rMHCQUNMjyEC/5w8zp1NVGxd9sGXrXCs4O6cL4FUmB2HAFVA==\n-----END PRIVATE KEY-----");
        localStorage.setItem("pubKey", "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsEWxGVFMvU5FzKeE2DK+LgQKhIvwoNmDL6cEOJ4CrDJ8mV1r5wJ+QToJhhR2hfPkoYglv1+12B5Tkp/gfzkTpkOb6IkWSuW0DlI6sqe+5h2btYaN4VMaC44FYOft3SJN3fgSlvwIN0V36ZJOVSGDvoas+jJKHRYPQwh4A5nv13kXvptK0HiEeCpUYBJa0CLL0PrikeqC63rm/9fASbNYZaqtij8n3FE2zD9BKvMWBB3qukLpkACawXoxIX2UpA1q6VtEalyNWGQfWtpI5E70YKO7evdeSNvtgU7WybpDQxUcMnCq6PvrbSiZqW4r1HLQ6boKU5mv/77vKZsEIbGRtQIDAQAB\n-----END PUBLIC KEY-----")
        localStorage.setItem("friends", "{\"TEST1\":\"alice\",\"TEST2\":\"bob\"}");
        localStorage.setItem("groups", '[{"groupInfo":{"users":["FAoHNhATzrCRHlls4rYuWyAd9ZJa9dZ+TnzSChXE8h8="],"fingerprint":"FAoHNhATzrCRHlls4rYuWyAd9ZJa9dZ+"},"chatLog":[{"sender":"FAoHNhATzrCRHlls4rYuWyAd9ZJa9dZ+TnzSChXE8h8=","message":"hello"},{"sender":"TEST2","message":"hi"}]}]');
        localStorage.setItem("servers", "[\"ws://localhost:3307/\"]");
    }, []);

    return <UserProvider><ChatProvider><ChatWrapper></ChatWrapper></ChatProvider></UserProvider>
}