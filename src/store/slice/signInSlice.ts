import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for sign-in
interface SignInState {
  email: string;
  password: string;
}

const initialState: SignInState = {
  email: "",
  password: "",
};

const signInFormSlice = createSlice({
  name: "signInForm",
  initialState,
  reducers: {
    updateSignInFormField(
      state,
      action: PayloadAction<{ field: keyof SignInState; value: string }>
    ) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetSignInForm(state) {
      state.email = "";
      state.password = "";
    },
  },
});

export const { updateSignInFormField, resetSignInForm } = signInFormSlice.actions;

export default signInFormSlice.reducer;


