import jwtDecode from "jwt-decode";

export default function fixDecoded(token) {

    try {
        const jwtToken = jwtDecode(token);

        return jwtToken;

    } catch (error) {
        console.log(error);

        return false;
    }
}