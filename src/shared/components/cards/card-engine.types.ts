import type { ReactNode } from "react";

export type CardSize = "sm" | "md" | "lg";
export type CardLayout = "vertical" | "horizontal";
export type MediaType = "image" | "video";
export type ShadowVariant = "none" | "sm" | "md" | "lg" | "xl";
export type ImageVariant = "cover" | "logo" | "icon" | "avatar";
export type MediaPosition = "top" | "bottom" | "left" | "right";
export type Alignment = "start" | "center" | "right";
export type ImageBleed = "edge-to-edge" | "padded";

export interface CardMetaItem {
    icon?: ReactNode;
    text: string;
}

export interface CardBadge {
    label: string;
    href?: string;
}

// IntelliSense Autocomplete + Custom String Support
type DataKey<T> = keyof T | (string & {});

export interface CardConfig<T extends Record<string, any> = Record<string, any>> {
    titleKey?: DataKey<T>;
    descriptionKey?: DataKey<T>;
    imageKey?: DataKey<T>;
    videoKey?: DataKey<T>;
    logoKey?: DataKey<T>;
    iconKey?: DataKey<T>;
    avatarKey?: DataKey<T>;

    getTitle?: (data: T) => string;
    getDescription?: (data: T) => string | undefined;
    getImage?: (data: T) => string | undefined;
    getVideo?: (data: T) => string | undefined;
    getLogo?: (data: T) => string | undefined;
    getIcon?: (data: T) => string | undefined;
    getAvatar?: (data: T) => string | undefined;

    imageVariant?: ImageVariant;
    href?: string | ((data: T) => string);
    getMetaItems?: (data: T) => CardMetaItem[];
    getBadges?: (data: T) => CardBadge[];
    actionLabel?: string;
}

export interface CardEngineProps<T extends Record<string, any> = Record<string, any>> {
    data: T;
    config: CardConfig<T>;
    size?: CardSize;
    layout?: CardLayout;
    mediaType?: MediaType;
    shadow?: ShadowVariant;
    mediaPosition?: MediaPosition;
    imageBleed?: ImageBleed;
    alignment?: Alignment;
    className?: string;
}