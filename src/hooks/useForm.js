import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMountedRef from "./useIsMountedRef";

function useForm(initialState = {}, onSubmit, validateForm) {
  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState([]);
  const [formSuccess, setFormSuccess] = useState(false);
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
    setFormErrors([]);
    setFormSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(formData, setFormErrors);
    if (!isValid) return;

    const result = await onSubmit?.(formData);
    if (result.success) {
      if (isMountedRef.current) {
        setFormSuccess(true);
        navigate(result.redirectUrl || '/');  // navigate to the URL returned by handleAddHolding
      }
    } else {
      if (isMountedRef.current) {
        setFormErrors(result.errors);
        setFormSuccess(false);
      }
    }
  };

  return { formData, formErrors, formSuccess, handleChange, handleSubmit };
}
export { useForm };
