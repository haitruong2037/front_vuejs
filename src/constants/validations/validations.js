import * as yup from "yup";

export const registerValidation = yup.object( {
    name: yup.string().label('Name').required(),
    email: yup.string().label('Email').email().required(),
    password: yup.string().label('Password').min( 6 ).required(),
    password_confirmation: yup.string().label('Password confirmation').required().oneOf( [yup.ref( 'password' )], 'Passwords must match' ),
    address: yup.string().label('Address').required(),
    phone: yup.string().label('Phone').matches( /^[0-9]{10,11}$/, 'Phone must be 10 or 11 digits' ).required(),
} );

export const updateProfileValidation = yup.object( {
    name: yup.string().label('Name').required(),
    email: yup.string().label('Email').email().required(),
    address: yup.string().label('Address').required(),
    phone: yup.string().label('Phone').matches( /^[0-9]{10,11}$/, 'Phone must be 10 or 11 digits' ).required(),
} );

export const passwordValidation = yup.object( {
    old_password: yup.string().label('Old password').required(),
    new_password: yup.string().label('New Password').min( 6 ).required(),
    new_password_confirmation: yup.string().label('Confirm New Password').required().oneOf( [yup.ref( 'new_password' )], 'Passwords must match' ),
} );

export const forgotPasswordRequestValidation = yup.object({
    email: yup.string().label("Email").email().required(),
});

export const resetPasswordValidation = yup.object( {
    password: yup.string().label('New Password').min( 6 ).required(),
    password_confirmation: yup.string().label('Confirm New Password').required().oneOf( [yup.ref( 'password' )], 'Passwords must match' ),
} );

export const addressValidation = yup.object( {
    name: yup.string().label('Name').required(),
    address: yup.string().label('Address').required(),
    phone: yup.string().label('Phone').matches( /^[0-9]{10,11}$/, 'Phone must be 10 or 11 digits' ).required(),
} );