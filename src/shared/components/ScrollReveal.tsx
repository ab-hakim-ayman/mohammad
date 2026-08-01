"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const scrollRevealVariants = cva(
  "transform-gpu backface-hidden motion-safe:transition-all motion-safe:ease-[cubic-bezier(0.21,0.47,0.32,0.98)] will-change-[transform,opacity,filter] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:blur-none",
  {
    variants: {
      variant: {
        "fade-up":
          "translate-y-4 opacity-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        "fade-down":
          "-translate-y-4 opacity-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        "fade-left":
          "translate-x-4 opacity-0 data-[visible=true]:translate-x-0 data-[visible=true]:opacity-100",
        "fade-right":
          "-translate-x-4 opacity-0 data-[visible=true]:translate-x-0 data-[visible=true]:opacity-100",
        "zoom-in":
          "scale-[0.97] opacity-0 data-[visible=true]:scale-100 data-[visible=true]:opacity-100",
        "blur-reveal":
          "blur-soft translate-y-3 opacity-0 data-[visible=true]:blur-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
        "glass-reveal":
          "scale-[0.98] blur-xs translate-y-2 opacity-0 data-[visible=true]:scale-100 data-[visible=true]:blur-0 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100",
      },
    },
    defaultVariants: {
      variant: "fade-up",
    },
  }
);

interface ScrollRevealProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof scrollRevealVariants> {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  as: Tag = "div",
  children,
  className,
  variant,
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (once && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else {
          if (!once) setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // Fast trigger point for high frame rates
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, once, threshold]);

  return (
    <Tag
      ref={ref}
      data-visible={isVisible}
      className={cn(scrollRevealVariants({ variant }), className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
