import React from 'react';

export type CardSize = "sm" | "md" | "lg";
export type CardLayout = "vertical" | "horizontal";
export type MediaType = "image" | "video";
export type ShadowVariant = "none" | "sm" | "md" | "lg" | "xl";
export type ImageVariant = "cover" | "logo" | "icon" | "avatar";
export type MediaPosition = "top" | "bottom" | "left" | "right";
export type Alignment = "start" | "center" | "right";
export type ImageBleed = "edge-to-edge" | "padded";

export interface CardMetaItem {
    icon?: React.ReactNode;
    text: string;
}

export interface CardBadge {
    label: string;
    href?: string;
}

export interface CardConfig<T> {
    titleKey?: keyof T | string;
    descriptionKey?: keyof T | string;
    imageKey?: keyof T | string;
    videoKey?: keyof T | string;
    logoKey?: keyof T | string;
    iconKey?: keyof T | string;
    avatarKey?: keyof T | string;

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

export interface CardEngineProps<T> {
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