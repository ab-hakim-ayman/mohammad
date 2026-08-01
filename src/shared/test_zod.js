const { z } = require("zod");

const schema = z.object({
  isFeatured: z.coerce.boolean().optional()
});

console.log("Coercing 'true':", schema.safeParse({ isFeatured: "true" }));
console.log("Coercing 'false':", schema.safeParse({ isFeatured: "false" }));

const safeSchema = z.object({
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  )
});

console.log("Safe coercing 'true':", safeSchema.safeParse({ isFeatured: "true" }));
console.log("Safe coercing 'false':", safeSchema.safeParse({ isFeatured: "false" }));
