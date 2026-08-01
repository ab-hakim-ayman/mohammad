import I18n from "@/shared/components/I18n";

import { batchResolveMediaAltText } from "./batch-resolve-alt-text";

type MediaAltTextFields = Partial<Record<`${string}Alt`, string>>;
type MediaFieldMap<T> = Record<string, Extract<keyof T, string>>;

export async function enrichEntitiesWithAltText<T extends { id: string }>(
  entityType: string,
  entities: T[],
  mediaFieldMap: MediaFieldMap<T>
): Promise<Array<T & MediaAltTextFields>> {
  if (entities.length === 0) return entities;

  const batchInput = entities.map((entity) => {
    const mediaFields: Record<string, string | null | undefined> = {};
    for (const [fieldName, entityKey] of Object.entries(mediaFieldMap)) {
      const value = entity[entityKey];
      let mediaValue: string | null | undefined;
      if (typeof value === "string") {
        mediaValue = value;
      } else if (value === null) {
        mediaValue = null;
      }
      mediaFields[fieldName] = mediaValue;
    }
    return { entityId: entity.id, mediaFields };
  });

  const altTextMap = await batchResolveMediaAltText(entityType, batchInput);

  const enriched = entities.map<T & MediaAltTextFields>((entity) => {
    const resolved = altTextMap.get(entity.id);
    if (!resolved) return entity;

    const altFields: MediaAltTextFields = {};
    for (const [fieldName, altText] of Object.entries(resolved.altTexts)) {
      const altKey = fieldName.concat("Alt") as keyof MediaAltTextFields;
      altFields[altKey] = altText;
    }
    return { ...entity, ...altFields };
  });

  return enriched;
}
