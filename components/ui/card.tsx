import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white rounded-lg border border-gray-200 shadow-sm",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("px-6 py-4 border-b border-gray-200", className)}
                {...props}
            />
        );
    }
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn("text-lg font-semibold text-gray-900", className)}
                {...props}
            />
        );
    }
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn("text-sm text-gray-500 mt-1", className)}
                {...props}
            />
        );
    }
);
CardDescription.displayName = "CardDescription";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
        );
    }
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg",
                    className
                )}
                {...props}
            />
        );
    }
);
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    type CardProps,
    type CardHeaderProps,
    type CardTitleProps,
    type CardDescriptionProps,
    type CardContentProps,
    type CardFooterProps,
};
