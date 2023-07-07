import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValue: z.ZodType<Prisma.JsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(JsonValue)),
  z.lazy(() => z.record(JsonValue)),
]);

export type JsonValueType = z.infer<typeof JsonValue>;

export const NullableJsonValue = z
  .union([JsonValue, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValue: z.ZodType<Prisma.InputJsonValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.lazy(() => z.array(InputJsonValue.nullable())),
  z.lazy(() => z.record(InputJsonValue.nullable())),
]);

export type InputJsonValueType = z.infer<typeof InputJsonValue>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','password']);

export const PreferencesScalarFieldEnumSchema = z.enum(['id','userId','classificationModel','extractionModel','analysisModel','receiptExampleExtractionId','invoiceExampleExtractionId','cardStatementExampleExtractionId','createdAt','updatedAt']);

export const ExtractionScalarFieldEnumSchema = z.enum(['id','userId','filename','objectPath','status','category','text','json','createdAt','updatedAt']);

export const ReceiptScalarFieldEnumSchema = z.enum(['id','userId','extractionId','objectPath','from','category','total','date','number','time','subtotal','tax','tip','createdAt','updatedAt']);

export const ReceiptItemScalarFieldEnumSchema = z.enum(['id','receiptId','description','quantity','amount']);

export const InvoiceScalarFieldEnumSchema = z.enum(['id','userId','extractionId','objectPath','category','fromName','totalAmountDue','date','invoiceNumber','fromAddress','toName','toAddress','currency','createdAt','updatedAt']);

export const InvoiceItemScalarFieldEnumSchema = z.enum(['id','invoiceId','description','amount']);

export const CardStatementScalarFieldEnumSchema = z.enum(['id','userId','extractionId','objectPath','date','issuerName','totalAmountDue','issuerAddress','recipientName','recipientAddress','creditCardName','creditCardHolder','creditCardNumber','currency','createdAt','updatedAt']);

export const CardTransactionScalarFieldEnumSchema = z.enum(['id','cardStatementId','category','description','amount']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((v) => transformJsonNull(v));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]);

export const StatusSchema = z.enum(['TO_RECOGNIZE','TO_EXTRACT','TO_VERIFY','PROCESSED']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  password: z.string(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  extractions: ExtractionWithRelations[];
  receipts: ReceiptWithRelations[];
  invoices: InvoiceWithRelations[];
  cardStatements: CardStatementWithRelations[];
  preferences?: PreferencesWithRelations | null;
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  extractions: z.lazy(() => ExtractionWithRelationsSchema).array(),
  receipts: z.lazy(() => ReceiptWithRelationsSchema).array(),
  invoices: z.lazy(() => InvoiceWithRelationsSchema).array(),
  cardStatements: z.lazy(() => CardStatementWithRelationsSchema).array(),
  preferences: z.lazy(() => PreferencesWithRelationsSchema).nullable(),
}))

// USER OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type UserOptionalDefaultsRelations = {
  extractions: ExtractionOptionalDefaultsWithRelations[];
  receipts: ReceiptOptionalDefaultsWithRelations[];
  invoices: InvoiceOptionalDefaultsWithRelations[];
  cardStatements: CardStatementOptionalDefaultsWithRelations[];
  preferences?: PreferencesOptionalDefaultsWithRelations | null;
};

export type UserOptionalDefaultsWithRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserOptionalDefaultsRelations

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> = UserOptionalDefaultsSchema.merge(z.object({
  extractions: z.lazy(() => ExtractionOptionalDefaultsWithRelationsSchema).array(),
  receipts: z.lazy(() => ReceiptOptionalDefaultsWithRelationsSchema).array(),
  invoices: z.lazy(() => InvoiceOptionalDefaultsWithRelationsSchema).array(),
  cardStatements: z.lazy(() => CardStatementOptionalDefaultsWithRelationsSchema).array(),
  preferences: z.lazy(() => PreferencesOptionalDefaultsWithRelationsSchema).nullable(),
}))

// USER PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type UserPartialRelations = {
  extractions?: ExtractionPartialWithRelations[];
  receipts?: ReceiptPartialWithRelations[];
  invoices?: InvoicePartialWithRelations[];
  cardStatements?: CardStatementPartialWithRelations[];
  preferences?: PreferencesPartialWithRelations | null;
};

export type UserPartialWithRelations = z.infer<typeof UserPartialSchema> & UserPartialRelations

export const UserPartialWithRelationsSchema: z.ZodType<UserPartialWithRelations> = UserPartialSchema.merge(z.object({
  extractions: z.lazy(() => ExtractionPartialWithRelationsSchema).array(),
  receipts: z.lazy(() => ReceiptPartialWithRelationsSchema).array(),
  invoices: z.lazy(() => InvoicePartialWithRelationsSchema).array(),
  cardStatements: z.lazy(() => CardStatementPartialWithRelationsSchema).array(),
  preferences: z.lazy(() => PreferencesPartialWithRelationsSchema).nullable(),
})).partial()

export type UserOptionalDefaultsWithPartialRelations = z.infer<typeof UserOptionalDefaultsSchema> & UserPartialRelations

export const UserOptionalDefaultsWithPartialRelationsSchema: z.ZodType<UserOptionalDefaultsWithPartialRelations> = UserOptionalDefaultsSchema.merge(z.object({
  extractions: z.lazy(() => ExtractionPartialWithRelationsSchema).array(),
  receipts: z.lazy(() => ReceiptPartialWithRelationsSchema).array(),
  invoices: z.lazy(() => InvoicePartialWithRelationsSchema).array(),
  cardStatements: z.lazy(() => CardStatementPartialWithRelationsSchema).array(),
  preferences: z.lazy(() => PreferencesPartialWithRelationsSchema).nullable(),
}).partial())

export type UserWithPartialRelations = z.infer<typeof UserSchema> & UserPartialRelations

export const UserWithPartialRelationsSchema: z.ZodType<UserWithPartialRelations> = UserSchema.merge(z.object({
  extractions: z.lazy(() => ExtractionPartialWithRelationsSchema).array(),
  receipts: z.lazy(() => ReceiptPartialWithRelationsSchema).array(),
  invoices: z.lazy(() => InvoicePartialWithRelationsSchema).array(),
  cardStatements: z.lazy(() => CardStatementPartialWithRelationsSchema).array(),
  preferences: z.lazy(() => PreferencesPartialWithRelationsSchema).nullable(),
}).partial())

/////////////////////////////////////////
// PREFERENCES SCHEMA
/////////////////////////////////////////

export const PreferencesSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  classificationModel: z.string(),
  extractionModel: z.string(),
  analysisModel: z.string(),
  receiptExampleExtractionId: z.string().nullable(),
  invoiceExampleExtractionId: z.string().nullable(),
  cardStatementExampleExtractionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Preferences = z.infer<typeof PreferencesSchema>

/////////////////////////////////////////
// PREFERENCES PARTIAL SCHEMA
/////////////////////////////////////////

export const PreferencesPartialSchema = PreferencesSchema.partial()

export type PreferencesPartial = z.infer<typeof PreferencesPartialSchema>

// PREFERENCES OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const PreferencesOptionalDefaultsSchema = PreferencesSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type PreferencesOptionalDefaults = z.infer<typeof PreferencesOptionalDefaultsSchema>

// PREFERENCES RELATION SCHEMA
//------------------------------------------------------

export type PreferencesRelations = {
  user: UserWithRelations;
};

export type PreferencesWithRelations = z.infer<typeof PreferencesSchema> & PreferencesRelations

export const PreferencesWithRelationsSchema: z.ZodType<PreferencesWithRelations> = PreferencesSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

// PREFERENCES OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type PreferencesOptionalDefaultsRelations = {
  user: UserOptionalDefaultsWithRelations;
};

export type PreferencesOptionalDefaultsWithRelations = z.infer<typeof PreferencesOptionalDefaultsSchema> & PreferencesOptionalDefaultsRelations

export const PreferencesOptionalDefaultsWithRelationsSchema: z.ZodType<PreferencesOptionalDefaultsWithRelations> = PreferencesOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// PREFERENCES PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type PreferencesPartialRelations = {
  user?: UserPartialWithRelations;
};

export type PreferencesPartialWithRelations = z.infer<typeof PreferencesPartialSchema> & PreferencesPartialRelations

export const PreferencesPartialWithRelationsSchema: z.ZodType<PreferencesPartialWithRelations> = PreferencesPartialSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type PreferencesOptionalDefaultsWithPartialRelations = z.infer<typeof PreferencesOptionalDefaultsSchema> & PreferencesPartialRelations

export const PreferencesOptionalDefaultsWithPartialRelationsSchema: z.ZodType<PreferencesOptionalDefaultsWithPartialRelations> = PreferencesOptionalDefaultsSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type PreferencesWithPartialRelations = z.infer<typeof PreferencesSchema> & PreferencesPartialRelations

export const PreferencesWithPartialRelationsSchema: z.ZodType<PreferencesWithPartialRelations> = PreferencesSchema.merge(z.object({
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// EXTRACTION SCHEMA
/////////////////////////////////////////

export const ExtractionSchema = z.object({
  status: StatusSchema,
  id: z.string().uuid(),
  userId: z.string(),
  filename: z.string(),
  objectPath: z.string(),
  category: z.string().nullable(),
  text: z.string().nullable(),
  json: NullableJsonValue.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Extraction = z.infer<typeof ExtractionSchema>

/////////////////////////////////////////
// EXTRACTION PARTIAL SCHEMA
/////////////////////////////////////////

export const ExtractionPartialSchema = ExtractionSchema.partial()

export type ExtractionPartial = z.infer<typeof ExtractionPartialSchema>

// EXTRACTION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ExtractionOptionalDefaultsSchema = ExtractionSchema.merge(z.object({
  status: StatusSchema.optional(),
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ExtractionOptionalDefaults = z.infer<typeof ExtractionOptionalDefaultsSchema>

// EXTRACTION RELATION SCHEMA
//------------------------------------------------------

export type ExtractionRelations = {
  receipt?: ReceiptWithRelations | null;
  invoice?: InvoiceWithRelations | null;
  cardStatement?: CardStatementWithRelations | null;
  user: UserWithRelations;
};

export type ExtractionWithRelations = Omit<z.infer<typeof ExtractionSchema>, "json"> & {
  json?: NullableJsonInput;
} & ExtractionRelations

export const ExtractionWithRelationsSchema: z.ZodType<ExtractionWithRelations> = ExtractionSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptWithRelationsSchema).nullable(),
  invoice: z.lazy(() => InvoiceWithRelationsSchema).nullable(),
  cardStatement: z.lazy(() => CardStatementWithRelationsSchema).nullable(),
  user: z.lazy(() => UserWithRelationsSchema),
}))

// EXTRACTION OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ExtractionOptionalDefaultsRelations = {
  receipt?: ReceiptOptionalDefaultsWithRelations | null;
  invoice?: InvoiceOptionalDefaultsWithRelations | null;
  cardStatement?: CardStatementOptionalDefaultsWithRelations | null;
  user: UserOptionalDefaultsWithRelations;
};

export type ExtractionOptionalDefaultsWithRelations = Omit<z.infer<typeof ExtractionOptionalDefaultsSchema>, "json"> & {
  json?: NullableJsonInput;
} & ExtractionOptionalDefaultsRelations

export const ExtractionOptionalDefaultsWithRelationsSchema: z.ZodType<ExtractionOptionalDefaultsWithRelations> = ExtractionOptionalDefaultsSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptOptionalDefaultsWithRelationsSchema).nullable(),
  invoice: z.lazy(() => InvoiceOptionalDefaultsWithRelationsSchema).nullable(),
  cardStatement: z.lazy(() => CardStatementOptionalDefaultsWithRelationsSchema).nullable(),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
}))

// EXTRACTION PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ExtractionPartialRelations = {
  receipt?: ReceiptPartialWithRelations | null;
  invoice?: InvoicePartialWithRelations | null;
  cardStatement?: CardStatementPartialWithRelations | null;
  user?: UserPartialWithRelations;
};

export type ExtractionPartialWithRelations = Omit<z.infer<typeof ExtractionPartialSchema>, "json"> & {
  json?: NullableJsonInput;
} & ExtractionPartialRelations

export const ExtractionPartialWithRelationsSchema: z.ZodType<ExtractionPartialWithRelations> = ExtractionPartialSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema).nullable(),
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema).nullable(),
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema).nullable(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
})).partial()

export type ExtractionOptionalDefaultsWithPartialRelations = Omit<z.infer<typeof ExtractionOptionalDefaultsSchema>, "json"> & {
  json?: NullableJsonInput;
} & ExtractionPartialRelations

export const ExtractionOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ExtractionOptionalDefaultsWithPartialRelations> = ExtractionOptionalDefaultsSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema).nullable(),
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema).nullable(),
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema).nullable(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

export type ExtractionWithPartialRelations = Omit<z.infer<typeof ExtractionSchema>, "json"> & {
  json?: NullableJsonInput;
} & ExtractionPartialRelations

export const ExtractionWithPartialRelationsSchema: z.ZodType<ExtractionWithPartialRelations> = ExtractionSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema).nullable(),
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema).nullable(),
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema).nullable(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// RECEIPT SCHEMA
/////////////////////////////////////////

export const ReceiptSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  extractionId: z.string(),
  objectPath: z.string(),
  from: z.string(),
  category: z.string(),
  total: z.number(),
  date: z.coerce.date(),
  number: z.string().nullable(),
  time: z.string().nullable(),
  subtotal: z.number().nullable(),
  tax: z.number().nullable(),
  tip: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Receipt = z.infer<typeof ReceiptSchema>

/////////////////////////////////////////
// RECEIPT PARTIAL SCHEMA
/////////////////////////////////////////

export const ReceiptPartialSchema = ReceiptSchema.partial()

export type ReceiptPartial = z.infer<typeof ReceiptPartialSchema>

// RECEIPT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ReceiptOptionalDefaultsSchema = ReceiptSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type ReceiptOptionalDefaults = z.infer<typeof ReceiptOptionalDefaultsSchema>

// RECEIPT RELATION SCHEMA
//------------------------------------------------------

export type ReceiptRelations = {
  items: ReceiptItemWithRelations[];
  user: UserWithRelations;
  extraction: ExtractionWithRelations;
};

export type ReceiptWithRelations = z.infer<typeof ReceiptSchema> & ReceiptRelations

export const ReceiptWithRelationsSchema: z.ZodType<ReceiptWithRelations> = ReceiptSchema.merge(z.object({
  items: z.lazy(() => ReceiptItemWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema),
  extraction: z.lazy(() => ExtractionWithRelationsSchema),
}))

// RECEIPT OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ReceiptOptionalDefaultsRelations = {
  items: ReceiptItemOptionalDefaultsWithRelations[];
  user: UserOptionalDefaultsWithRelations;
  extraction: ExtractionOptionalDefaultsWithRelations;
};

export type ReceiptOptionalDefaultsWithRelations = z.infer<typeof ReceiptOptionalDefaultsSchema> & ReceiptOptionalDefaultsRelations

export const ReceiptOptionalDefaultsWithRelationsSchema: z.ZodType<ReceiptOptionalDefaultsWithRelations> = ReceiptOptionalDefaultsSchema.merge(z.object({
  items: z.lazy(() => ReceiptItemOptionalDefaultsWithRelationsSchema).array(),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  extraction: z.lazy(() => ExtractionOptionalDefaultsWithRelationsSchema),
}))

// RECEIPT PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ReceiptPartialRelations = {
  items?: ReceiptItemPartialWithRelations[];
  user?: UserPartialWithRelations;
  extraction?: ExtractionPartialWithRelations;
};

export type ReceiptPartialWithRelations = z.infer<typeof ReceiptPartialSchema> & ReceiptPartialRelations

export const ReceiptPartialWithRelationsSchema: z.ZodType<ReceiptPartialWithRelations> = ReceiptPartialSchema.merge(z.object({
  items: z.lazy(() => ReceiptItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
})).partial()

export type ReceiptOptionalDefaultsWithPartialRelations = z.infer<typeof ReceiptOptionalDefaultsSchema> & ReceiptPartialRelations

export const ReceiptOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ReceiptOptionalDefaultsWithPartialRelations> = ReceiptOptionalDefaultsSchema.merge(z.object({
  items: z.lazy(() => ReceiptItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

export type ReceiptWithPartialRelations = z.infer<typeof ReceiptSchema> & ReceiptPartialRelations

export const ReceiptWithPartialRelationsSchema: z.ZodType<ReceiptWithPartialRelations> = ReceiptSchema.merge(z.object({
  items: z.lazy(() => ReceiptItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// RECEIPT ITEM SCHEMA
/////////////////////////////////////////

export const ReceiptItemSchema = z.object({
  id: z.string().uuid(),
  receiptId: z.string(),
  description: z.string(),
  quantity: z.number(),
  amount: z.number(),
})

export type ReceiptItem = z.infer<typeof ReceiptItemSchema>

/////////////////////////////////////////
// RECEIPT ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const ReceiptItemPartialSchema = ReceiptItemSchema.partial()

export type ReceiptItemPartial = z.infer<typeof ReceiptItemPartialSchema>

// RECEIPT ITEM OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const ReceiptItemOptionalDefaultsSchema = ReceiptItemSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type ReceiptItemOptionalDefaults = z.infer<typeof ReceiptItemOptionalDefaultsSchema>

// RECEIPT ITEM RELATION SCHEMA
//------------------------------------------------------

export type ReceiptItemRelations = {
  receipt: ReceiptWithRelations;
};

export type ReceiptItemWithRelations = z.infer<typeof ReceiptItemSchema> & ReceiptItemRelations

export const ReceiptItemWithRelationsSchema: z.ZodType<ReceiptItemWithRelations> = ReceiptItemSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptWithRelationsSchema),
}))

// RECEIPT ITEM OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type ReceiptItemOptionalDefaultsRelations = {
  receipt: ReceiptOptionalDefaultsWithRelations;
};

export type ReceiptItemOptionalDefaultsWithRelations = z.infer<typeof ReceiptItemOptionalDefaultsSchema> & ReceiptItemOptionalDefaultsRelations

export const ReceiptItemOptionalDefaultsWithRelationsSchema: z.ZodType<ReceiptItemOptionalDefaultsWithRelations> = ReceiptItemOptionalDefaultsSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptOptionalDefaultsWithRelationsSchema),
}))

// RECEIPT ITEM PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type ReceiptItemPartialRelations = {
  receipt?: ReceiptPartialWithRelations;
};

export type ReceiptItemPartialWithRelations = z.infer<typeof ReceiptItemPartialSchema> & ReceiptItemPartialRelations

export const ReceiptItemPartialWithRelationsSchema: z.ZodType<ReceiptItemPartialWithRelations> = ReceiptItemPartialSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema),
})).partial()

export type ReceiptItemOptionalDefaultsWithPartialRelations = z.infer<typeof ReceiptItemOptionalDefaultsSchema> & ReceiptItemPartialRelations

export const ReceiptItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<ReceiptItemOptionalDefaultsWithPartialRelations> = ReceiptItemOptionalDefaultsSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema),
}).partial())

export type ReceiptItemWithPartialRelations = z.infer<typeof ReceiptItemSchema> & ReceiptItemPartialRelations

export const ReceiptItemWithPartialRelationsSchema: z.ZodType<ReceiptItemWithPartialRelations> = ReceiptItemSchema.merge(z.object({
  receipt: z.lazy(() => ReceiptPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// INVOICE SCHEMA
/////////////////////////////////////////

export const InvoiceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  extractionId: z.string(),
  objectPath: z.string(),
  category: z.string(),
  fromName: z.string(),
  totalAmountDue: z.number(),
  date: z.coerce.date(),
  invoiceNumber: z.string().nullable(),
  fromAddress: z.string().nullable(),
  toName: z.string().nullable(),
  toAddress: z.string().nullable(),
  currency: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Invoice = z.infer<typeof InvoiceSchema>

/////////////////////////////////////////
// INVOICE PARTIAL SCHEMA
/////////////////////////////////////////

export const InvoicePartialSchema = InvoiceSchema.partial()

export type InvoicePartial = z.infer<typeof InvoicePartialSchema>

// INVOICE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const InvoiceOptionalDefaultsSchema = InvoiceSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type InvoiceOptionalDefaults = z.infer<typeof InvoiceOptionalDefaultsSchema>

// INVOICE RELATION SCHEMA
//------------------------------------------------------

export type InvoiceRelations = {
  items: InvoiceItemWithRelations[];
  user: UserWithRelations;
  extraction: ExtractionWithRelations;
};

export type InvoiceWithRelations = z.infer<typeof InvoiceSchema> & InvoiceRelations

export const InvoiceWithRelationsSchema: z.ZodType<InvoiceWithRelations> = InvoiceSchema.merge(z.object({
  items: z.lazy(() => InvoiceItemWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema),
  extraction: z.lazy(() => ExtractionWithRelationsSchema),
}))

// INVOICE OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type InvoiceOptionalDefaultsRelations = {
  items: InvoiceItemOptionalDefaultsWithRelations[];
  user: UserOptionalDefaultsWithRelations;
  extraction: ExtractionOptionalDefaultsWithRelations;
};

export type InvoiceOptionalDefaultsWithRelations = z.infer<typeof InvoiceOptionalDefaultsSchema> & InvoiceOptionalDefaultsRelations

export const InvoiceOptionalDefaultsWithRelationsSchema: z.ZodType<InvoiceOptionalDefaultsWithRelations> = InvoiceOptionalDefaultsSchema.merge(z.object({
  items: z.lazy(() => InvoiceItemOptionalDefaultsWithRelationsSchema).array(),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  extraction: z.lazy(() => ExtractionOptionalDefaultsWithRelationsSchema),
}))

// INVOICE PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type InvoicePartialRelations = {
  items?: InvoiceItemPartialWithRelations[];
  user?: UserPartialWithRelations;
  extraction?: ExtractionPartialWithRelations;
};

export type InvoicePartialWithRelations = z.infer<typeof InvoicePartialSchema> & InvoicePartialRelations

export const InvoicePartialWithRelationsSchema: z.ZodType<InvoicePartialWithRelations> = InvoicePartialSchema.merge(z.object({
  items: z.lazy(() => InvoiceItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
})).partial()

export type InvoiceOptionalDefaultsWithPartialRelations = z.infer<typeof InvoiceOptionalDefaultsSchema> & InvoicePartialRelations

export const InvoiceOptionalDefaultsWithPartialRelationsSchema: z.ZodType<InvoiceOptionalDefaultsWithPartialRelations> = InvoiceOptionalDefaultsSchema.merge(z.object({
  items: z.lazy(() => InvoiceItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

export type InvoiceWithPartialRelations = z.infer<typeof InvoiceSchema> & InvoicePartialRelations

export const InvoiceWithPartialRelationsSchema: z.ZodType<InvoiceWithPartialRelations> = InvoiceSchema.merge(z.object({
  items: z.lazy(() => InvoiceItemPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// INVOICE ITEM SCHEMA
/////////////////////////////////////////

export const InvoiceItemSchema = z.object({
  id: z.string().uuid(),
  invoiceId: z.string(),
  description: z.string(),
  amount: z.number().nullable(),
})

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>

/////////////////////////////////////////
// INVOICE ITEM PARTIAL SCHEMA
/////////////////////////////////////////

export const InvoiceItemPartialSchema = InvoiceItemSchema.partial()

export type InvoiceItemPartial = z.infer<typeof InvoiceItemPartialSchema>

// INVOICE ITEM OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const InvoiceItemOptionalDefaultsSchema = InvoiceItemSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type InvoiceItemOptionalDefaults = z.infer<typeof InvoiceItemOptionalDefaultsSchema>

// INVOICE ITEM RELATION SCHEMA
//------------------------------------------------------

export type InvoiceItemRelations = {
  invoice: InvoiceWithRelations;
};

export type InvoiceItemWithRelations = z.infer<typeof InvoiceItemSchema> & InvoiceItemRelations

export const InvoiceItemWithRelationsSchema: z.ZodType<InvoiceItemWithRelations> = InvoiceItemSchema.merge(z.object({
  invoice: z.lazy(() => InvoiceWithRelationsSchema),
}))

// INVOICE ITEM OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type InvoiceItemOptionalDefaultsRelations = {
  invoice: InvoiceOptionalDefaultsWithRelations;
};

export type InvoiceItemOptionalDefaultsWithRelations = z.infer<typeof InvoiceItemOptionalDefaultsSchema> & InvoiceItemOptionalDefaultsRelations

export const InvoiceItemOptionalDefaultsWithRelationsSchema: z.ZodType<InvoiceItemOptionalDefaultsWithRelations> = InvoiceItemOptionalDefaultsSchema.merge(z.object({
  invoice: z.lazy(() => InvoiceOptionalDefaultsWithRelationsSchema),
}))

// INVOICE ITEM PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type InvoiceItemPartialRelations = {
  invoice?: InvoicePartialWithRelations;
};

export type InvoiceItemPartialWithRelations = z.infer<typeof InvoiceItemPartialSchema> & InvoiceItemPartialRelations

export const InvoiceItemPartialWithRelationsSchema: z.ZodType<InvoiceItemPartialWithRelations> = InvoiceItemPartialSchema.merge(z.object({
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema),
})).partial()

export type InvoiceItemOptionalDefaultsWithPartialRelations = z.infer<typeof InvoiceItemOptionalDefaultsSchema> & InvoiceItemPartialRelations

export const InvoiceItemOptionalDefaultsWithPartialRelationsSchema: z.ZodType<InvoiceItemOptionalDefaultsWithPartialRelations> = InvoiceItemOptionalDefaultsSchema.merge(z.object({
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema),
}).partial())

export type InvoiceItemWithPartialRelations = z.infer<typeof InvoiceItemSchema> & InvoiceItemPartialRelations

export const InvoiceItemWithPartialRelationsSchema: z.ZodType<InvoiceItemWithPartialRelations> = InvoiceItemSchema.merge(z.object({
  invoice: z.lazy(() => InvoicePartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// CARD STATEMENT SCHEMA
/////////////////////////////////////////

export const CardStatementSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  extractionId: z.string(),
  objectPath: z.string(),
  date: z.coerce.date(),
  issuerName: z.string(),
  totalAmountDue: z.number(),
  issuerAddress: z.string().nullable(),
  recipientName: z.string().nullable(),
  recipientAddress: z.string().nullable(),
  creditCardName: z.string().nullable(),
  creditCardHolder: z.string().nullable(),
  creditCardNumber: z.string().nullable(),
  currency: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type CardStatement = z.infer<typeof CardStatementSchema>

/////////////////////////////////////////
// CARD STATEMENT PARTIAL SCHEMA
/////////////////////////////////////////

export const CardStatementPartialSchema = CardStatementSchema.partial()

export type CardStatementPartial = z.infer<typeof CardStatementPartialSchema>

// CARD STATEMENT OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CardStatementOptionalDefaultsSchema = CardStatementSchema.merge(z.object({
  id: z.string().uuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}))

export type CardStatementOptionalDefaults = z.infer<typeof CardStatementOptionalDefaultsSchema>

// CARD STATEMENT RELATION SCHEMA
//------------------------------------------------------

export type CardStatementRelations = {
  transactions: CardTransactionWithRelations[];
  user: UserWithRelations;
  extraction: ExtractionWithRelations;
};

export type CardStatementWithRelations = z.infer<typeof CardStatementSchema> & CardStatementRelations

export const CardStatementWithRelationsSchema: z.ZodType<CardStatementWithRelations> = CardStatementSchema.merge(z.object({
  transactions: z.lazy(() => CardTransactionWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema),
  extraction: z.lazy(() => ExtractionWithRelationsSchema),
}))

// CARD STATEMENT OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type CardStatementOptionalDefaultsRelations = {
  transactions: CardTransactionOptionalDefaultsWithRelations[];
  user: UserOptionalDefaultsWithRelations;
  extraction: ExtractionOptionalDefaultsWithRelations;
};

export type CardStatementOptionalDefaultsWithRelations = z.infer<typeof CardStatementOptionalDefaultsSchema> & CardStatementOptionalDefaultsRelations

export const CardStatementOptionalDefaultsWithRelationsSchema: z.ZodType<CardStatementOptionalDefaultsWithRelations> = CardStatementOptionalDefaultsSchema.merge(z.object({
  transactions: z.lazy(() => CardTransactionOptionalDefaultsWithRelationsSchema).array(),
  user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema),
  extraction: z.lazy(() => ExtractionOptionalDefaultsWithRelationsSchema),
}))

// CARD STATEMENT PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type CardStatementPartialRelations = {
  transactions?: CardTransactionPartialWithRelations[];
  user?: UserPartialWithRelations;
  extraction?: ExtractionPartialWithRelations;
};

export type CardStatementPartialWithRelations = z.infer<typeof CardStatementPartialSchema> & CardStatementPartialRelations

export const CardStatementPartialWithRelationsSchema: z.ZodType<CardStatementPartialWithRelations> = CardStatementPartialSchema.merge(z.object({
  transactions: z.lazy(() => CardTransactionPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
})).partial()

export type CardStatementOptionalDefaultsWithPartialRelations = z.infer<typeof CardStatementOptionalDefaultsSchema> & CardStatementPartialRelations

export const CardStatementOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CardStatementOptionalDefaultsWithPartialRelations> = CardStatementOptionalDefaultsSchema.merge(z.object({
  transactions: z.lazy(() => CardTransactionPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

export type CardStatementWithPartialRelations = z.infer<typeof CardStatementSchema> & CardStatementPartialRelations

export const CardStatementWithPartialRelationsSchema: z.ZodType<CardStatementWithPartialRelations> = CardStatementSchema.merge(z.object({
  transactions: z.lazy(() => CardTransactionPartialWithRelationsSchema).array(),
  user: z.lazy(() => UserPartialWithRelationsSchema),
  extraction: z.lazy(() => ExtractionPartialWithRelationsSchema),
}).partial())

/////////////////////////////////////////
// CARD TRANSACTION SCHEMA
/////////////////////////////////////////

export const CardTransactionSchema = z.object({
  id: z.string().uuid(),
  cardStatementId: z.string(),
  category: z.string(),
  description: z.string(),
  amount: z.number(),
})

export type CardTransaction = z.infer<typeof CardTransactionSchema>

/////////////////////////////////////////
// CARD TRANSACTION PARTIAL SCHEMA
/////////////////////////////////////////

export const CardTransactionPartialSchema = CardTransactionSchema.partial()

export type CardTransactionPartial = z.infer<typeof CardTransactionPartialSchema>

// CARD TRANSACTION OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const CardTransactionOptionalDefaultsSchema = CardTransactionSchema.merge(z.object({
  id: z.string().uuid().optional(),
}))

export type CardTransactionOptionalDefaults = z.infer<typeof CardTransactionOptionalDefaultsSchema>

// CARD TRANSACTION RELATION SCHEMA
//------------------------------------------------------

export type CardTransactionRelations = {
  cardStatement: CardStatementWithRelations;
};

export type CardTransactionWithRelations = z.infer<typeof CardTransactionSchema> & CardTransactionRelations

export const CardTransactionWithRelationsSchema: z.ZodType<CardTransactionWithRelations> = CardTransactionSchema.merge(z.object({
  cardStatement: z.lazy(() => CardStatementWithRelationsSchema),
}))

// CARD TRANSACTION OPTIONAL DEFAULTS RELATION SCHEMA
//------------------------------------------------------

export type CardTransactionOptionalDefaultsRelations = {
  cardStatement: CardStatementOptionalDefaultsWithRelations;
};

export type CardTransactionOptionalDefaultsWithRelations = z.infer<typeof CardTransactionOptionalDefaultsSchema> & CardTransactionOptionalDefaultsRelations

export const CardTransactionOptionalDefaultsWithRelationsSchema: z.ZodType<CardTransactionOptionalDefaultsWithRelations> = CardTransactionOptionalDefaultsSchema.merge(z.object({
  cardStatement: z.lazy(() => CardStatementOptionalDefaultsWithRelationsSchema),
}))

// CARD TRANSACTION PARTIAL RELATION SCHEMA
//------------------------------------------------------

export type CardTransactionPartialRelations = {
  cardStatement?: CardStatementPartialWithRelations;
};

export type CardTransactionPartialWithRelations = z.infer<typeof CardTransactionPartialSchema> & CardTransactionPartialRelations

export const CardTransactionPartialWithRelationsSchema: z.ZodType<CardTransactionPartialWithRelations> = CardTransactionPartialSchema.merge(z.object({
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema),
})).partial()

export type CardTransactionOptionalDefaultsWithPartialRelations = z.infer<typeof CardTransactionOptionalDefaultsSchema> & CardTransactionPartialRelations

export const CardTransactionOptionalDefaultsWithPartialRelationsSchema: z.ZodType<CardTransactionOptionalDefaultsWithPartialRelations> = CardTransactionOptionalDefaultsSchema.merge(z.object({
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema),
}).partial())

export type CardTransactionWithPartialRelations = z.infer<typeof CardTransactionSchema> & CardTransactionPartialRelations

export const CardTransactionWithPartialRelationsSchema: z.ZodType<CardTransactionWithPartialRelations> = CardTransactionSchema.merge(z.object({
  cardStatement: z.lazy(() => CardStatementPartialWithRelationsSchema),
}).partial())
