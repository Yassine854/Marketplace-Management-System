import { z } from "zod";

export const addressOrBillingAddressSchema = z.object({
  address_type: z.string(),
  city: z.string(),
  country_id: z.string(),
  email: z.string(),
  entity_id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  parent_id: z.number(),
  postcode: z.string(),
  region: z.string(),
  region_code: z.string(),
  region_id: z.number().optional().nullable(),
  street: z.array(z.string()).optional().nullable(),
  telephone: z.string(),
  customer_address_id: z.number().optional().nullable(),
});

export const paymentAdditionalInfoEntitySchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const customOptionsEntitySchema = z.object({
  option_id: z.string(),
  option_value: z.string(),
});

export const totalSchema = z.object({
  base_shipping_amount: z.number(),
  base_shipping_discount_amount: z.number(),
  base_shipping_discount_tax_compensation_amnt: z.number(),
  base_shipping_incl_tax: z.number(),
  base_shipping_tax_amount: z.number(),
  shipping_amount: z.number(),
  shipping_discount_amount: z.number(),
  shipping_discount_tax_compensation_amount: z.number(),
  shipping_incl_tax: z.number(),
  shipping_tax_amount: z.number(),
});

export const paymentSchema = z.object({
  account_status: z.null().optional(),
  additional_information: z.array(z.string()).optional().nullable(),
  amount_ordered: z.number(),
  base_amount_ordered: z.number(),
  base_shipping_amount: z.number(),
  cc_last4: z.null().optional(),
  entity_id: z.number(),
  method: z.string(),
  parent_id: z.number(),
  shipping_amount: z.number(),
  cc_exp_year: z.string().optional().nullable(),
  cc_ss_start_month: z.string().optional().nullable(),
  cc_ss_start_year: z.string().optional().nullable(),
});

export const statusHistoriesEntitySchema = z.object({
  comment: z.string().optional().nullable(),
  created_at: z.string(),
  entity_id: z.number(),
  entity_name: z.string(),
  is_customer_notified: z.number(),
  is_visible_on_front: z.number(),
  parent_id: z.number(),
  status: z.string(),
});

export const statusSchema = z.object({
  matched_tokens: z.array(z.string()).optional().nullable(),
  snippet: z.string(),
});

export const highlightsEntitySchema = z.object({
  field: z.string(),
  matched_tokens: z.array(z.string()).optional().nullable(),
  snippet: z.string(),
});

export const textMatchInfoSchema = z.object({
  best_field_score: z.string(),
  best_field_weight: z.number(),
  fields_matched: z.number(),
  score: z.string(),
  tokens_matched: z.number(),
});

export const requestParamsSchema = z.object({
  collection_name: z.string(),
  per_page: z.number(),
  q: z.string(),
});

export const extensionAttributes1Schema = z.object({
  custom_options: z.array(customOptionsEntitySchema).optional().nullable(),
});

export const shippingSchema = z.object({
  address: addressOrBillingAddressSchema,
  method: z.string(),
  total: totalSchema,
});

export const highlightSchema = z.object({
  status: statusSchema,
});

export const productOptionSchema = z.object({
  extension_attributes: extensionAttributes1Schema,
});

export const itemsEntitySchema = z.object({
  amount_refunded: z.number(),
  base_amount_refunded: z.number(),
  base_cost: z.number(),
  base_discount_amount: z.number(),
  base_discount_invoiced: z.number(),
  base_discount_tax_compensation_amount: z.number(),
  base_original_price: z.number(),
  base_price: z.number(),
  base_price_incl_tax: z.number(),
  base_row_invoiced: z.number(),
  base_row_total: z.number(),
  base_row_total_incl_tax: z.number(),
  base_tax_amount: z.number(),
  base_tax_invoiced: z.number(),
  created_at: z.string(),
  discount_amount: z.number(),
  discount_invoiced: z.number(),
  discount_percent: z.number(),
  discount_tax_compensation_amount: z.number(),
  free_shipping: z.number(),
  is_qty_decimal: z.number(),
  is_virtual: z.number(),
  item_id: z.number(),
  name: z.string(),
  no_discount: z.number(),
  order_id: z.number(),
  original_price: z.number(),
  price: z.number(),
  price_incl_tax: z.number(),
  product_id: z.number(),
  product_option: productOptionSchema.optional().nullable(),
  product_type: z.string(),
  qty_canceled: z.number(),
  qty_invoiced: z.number(),
  qty_ordered: z.number(),
  qty_refunded: z.number(),
  qty_shipped: z.number(),
  quote_item_id: z.number(),
  row_invoiced: z.number(),
  row_total: z.number(),
  row_total_incl_tax: z.number(),
  row_weight: z.number(),
  sku: z.string(),
  store_id: z.number(),
  tax_amount: z.number(),
  tax_invoiced: z.number(),
  tax_percent: z.number(),
  updated_at: z.string(),
  weight: z.number(),
});

export const shippingAssignmentsEntitySchema = z.object({
  items: z.array(itemsEntitySchema).optional().nullable(),
  shipping: shippingSchema,
});

export const extensionAttributesSchema = z.object({
  applied_taxes: z.array(z.null()).optional().nullable(),
  delivery_date: z.string(),
  from_mobile: z.number(),
  item_applied_taxes: z.array(z.null()).optional().nullable(),
  just_created: z.string(),
  kamioun_order_id: z.number(),
  loyalty_point_value: z.number(),
  payment_additional_info: z
    .array(paymentAdditionalInfoEntitySchema)
    .optional()
    .nullable(),
  shipping_assignments: z
    .array(shippingAssignmentsEntitySchema)
    .optional()
    .nullable(),
  verified: z.number(),
  creator: z.string().optional().nullable(),
  creator_id: z.number().optional().nullable(),
  agent_comment: z.string().optional().nullable(),
  delivery_slot: z.string().optional().nullable(),
  succeeded: z.string().optional().nullable(),
});

export const documentSchema = z.object({
  base_currency_code: z.string(),
  base_discount_amount: z.number(),
  base_discount_tax_compensation_amount: z.number(),
  base_grand_total: z.number(),
  base_shipping_amount: z.number(),
  base_shipping_discount_amount: z.number(),
  base_shipping_discount_tax_compensation_amnt: z.number(),
  base_shipping_incl_tax: z.number(),
  base_shipping_tax_amount: z.number(),
  base_subtotal: z.number(),
  base_subtotal_incl_tax: z.number(),
  base_tax_amount: z.number(),
  base_to_global_rate: z.number(),
  base_to_order_rate: z.number(),
  base_total_due: z.number(),
  billing_address: addressOrBillingAddressSchema,
  billing_address_id: z.number(),
  created_at: z.string(),
  customer_email: z.string(),
  customer_firstname: z.string(),
  customer_gender: z.number(),
  customer_group_id: z.number(),
  customer_id: z.number(),
  customer_is_guest: z.number(),
  customer_lastname: z.string(),
  customer_note_notify: z.number(),
  customer_taxvat: z.string().optional().nullable(),
  discount_amount: z.number(),
  discount_tax_compensation_amount: z.number(),
  email_sent: z.number(),
  entity_id: z.number(),
  extension_attributes: extensionAttributesSchema,
  global_currency_code: z.string(),
  grand_total: z.number(),
  id: z.string(),
  increment_id: z.string(),
  is_virtual: z.number(),
  items: z.array(itemsEntitySchema).optional().nullable(),
  order_currency_code: z.string(),
  payment: paymentSchema,
  protect_code: z.string(),
  quote_id: z.number(),
  remote_ip: z.string().optional().nullable(),
  shipping_amount: z.number(),
  shipping_description: z.string(),
  shipping_discount_amount: z.number(),
  shipping_discount_tax_compensation_amount: z.number(),
  shipping_incl_tax: z.number(),
  shipping_tax_amount: z.number(),
  state: z.string(),
  status: z.string(),
  status_histories: z.array(statusHistoriesEntitySchema).optional().nullable(),
  store_currency_code: z.string(),
  store_id: z.number(),
  store_name: z.string(),
  store_to_base_rate: z.number(),
  store_to_order_rate: z.number(),
  subtotal: z.number(),
  subtotal_incl_tax: z.number(),
  tax_amount: z.number(),
  total_due: z.number(),
  total_item_count: z.number(),
  total_qty_ordered: z.number(),
  updated_at: z.string(),
  weight: z.number(),
  edit_increment: z.number().optional().nullable(),
  original_increment_id: z.string().optional().nullable(),
  relation_parent_id: z.string().optional().nullable(),
  relation_parent_real_id: z.string().optional().nullable(),
});

export const hitsEntitySchema = z.object({
  document: documentSchema,
  highlight: highlightSchema,
  highlights: z.array(highlightsEntitySchema).optional().nullable(),
  text_match: z.number(),
  text_match_info: textMatchInfoSchema,
});

export const searchSchema = z.object({
  facet_counts: z.array(z.null()).optional().nullable(),
  found: z.number(),
  hits: z.array(hitsEntitySchema).optional().nullable(),
  out_of: z.number(),
  page: z.number(),
  request_params: requestParamsSchema,
  search_cutoff: z.boolean(),
  search_time_ms: z.number(),
});

export type Response = z.infer<typeof searchSchema>;
