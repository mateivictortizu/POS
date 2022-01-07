export const validName = new RegExp('^[ a-zA-Z0-9._:$!%-]+$');
export const validInvNumber = new RegExp('^[0-9]{12}$');
export const validSerialNumber = new RegExp('^[A-Z0-9]{10}$');
export const validNbMonths = new RegExp('^[0-9]+$')
export const validPassword = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$');
export const validPhone = new RegExp('^[0-9]+$');
export const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]+$');
export const validUsername = new RegExp('^([A-Z][a-z]+[ -]*)+$')