import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state for register form
interface RegisterState {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialState: RegisterState = {
  email: "",
  password: "",
  confirmPassword: "",
};

const registerFormSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    updateRegisterFormField(
      state,
      action: PayloadAction<{ field: keyof RegisterState; value: string }>
    ) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetRegisterForm(state) {
      state.email = "";
      state.password = "";
      state.confirmPassword = "";
    },
  },
});

export const { updateRegisterFormField, resetRegisterForm } = registerFormSlice.actions;

export default registerFormSlice.reducer;
