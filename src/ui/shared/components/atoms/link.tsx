import { MouseEvent, ReactNode } from "react";

type LinkVariant = 'resolved' | 'unresolved' | 'external';

type LinkProps = {
    children: ReactNode;
    href?: string;
    variant?: LinkVariant;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
};

export const Link = ({
    children,
    href,
    variant = 'resolved',
    onClick,
    className = ''
}: LinkProps) => {
    const variantClassMap: Record<LinkVariant, string> = {
        resolved: 'is-resolved',
        unresolved: 'is-unresolved',
        external: 'is-external',
    };
    const variantClass = variantClassMap[variant];

    return (
        <a
            href={href}
            className={`link-atom ${variantClass} ${className}`}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
        >
            {children}
        </a>
    );
};