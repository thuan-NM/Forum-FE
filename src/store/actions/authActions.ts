import { Login } from "../../services/AuthServices";
import { LoginCredentials } from "../interfaces/authInterfaces";
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT = "LOGOUT";

// Action creators thường (không phải thunk)
export const loginRequest = () => ({
    type: LOGIN_REQUEST as typeof LOGIN_REQUEST,
});

export const loginSuccess = (token: string, user: any) => ({
    type: LOGIN_SUCCESS as typeof LOGIN_SUCCESS,
    payload: { token, user },
});

export const loginFailure = (error: string) => ({
    type: LOGIN_FAILURE as typeof LOGIN_FAILURE,
    payload: error,
});

export const logout = () => ({
    type: LOGOUT as typeof LOGOUT,
});

// Thunk action để login
export const loginUser = (credentials: LoginCredentials) => {
    return async (dispatch: any) => {
        dispatch(loginRequest()); // => { loading: true }

        try {
            const data = (await Login(credentials)).data;
            const { token, user } = data;

            localStorage.setItem("auth", JSON.stringify({ token }));
            dispatch(loginSuccess(token, user)); // => { loading: false, isAuth: true }

            // **Trả về object** cho .then(...) trong component
            return { error: null, token, user };
        } catch (error: any) {
            const errorMessage = error?.response?.data?.error || "Login failed";
            dispatch(loginFailure(errorMessage)); // => { loading: false, error: errorMessage }

            // **throw** hoặc return để .then / .catch nhận được
            throw errorMessage;
            // hoặc: return { error: errorMessage };
        }
    };
};
