import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validateFn = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: val
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    setFieldValue,
    validate,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};
