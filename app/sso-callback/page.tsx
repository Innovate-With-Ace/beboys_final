import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbakc() {
    return <AuthenticateWithRedirectCallback />;
}