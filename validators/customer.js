import Joi from "@hapi/joi";
const customerValidation = Joi.object().keys({
  emailid: Joi.string().required().max(45),
  password: Joi.string().required().max(45),
  name: Joi.string().required().max(45),
  phoneno: Joi.string().required().max(10),
  active: Joi.optional().default(true),
});
const updateCustomerValidation = Joi.object().keys({
  password: Joi.string().optional().max(45),
  name: Joi.string().optional().max(45),
  phoneno: Joi.string().optional().max(10),
  active: Joi.optional().optional(true),
});
const updateCustomerValidationByCustomer = Joi.object().keys({
  name: Joi.string().optional().max(45),
  phoneno: Joi.string().optional().max(10),
});
export default {
  customerValidation,
  updateCustomerValidation,
  updateCustomerValidationByCustomer,
};
