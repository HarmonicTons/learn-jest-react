export const fetchValue = async (): Promise<string> => {
  // Cette fonction doit être mockée dans les TU
  await new Promise(r => setTimeout(r, 2000));
  return "FETCH_VALUE_RESULT";
};
