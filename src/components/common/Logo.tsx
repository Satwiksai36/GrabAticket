import React from 'react';
import { Ticket } from 'lucide-react';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
    className = "",
    iconClassName = "h-8 w-8",
    textClassName = "text-xl"
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex items-center justify-center">
                <div className="relative transform -rotate-12 transition-transform hover:rotate-0 duration-300">
                    <Ticket
                        className={`text-primary fill-primary/20 ${iconClassName}`}
                        strokeWidth={2.5}
                    />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.6rem] font-bold text-primary pointer-events-none select-none">
                        S
                    </span>
                </div>
            </div>
            <span className={`font-bold text-foreground tracking-tight ${textClassName}`}>
                Grab<span className="text-primary">A</span>ticket
            </span>
        </div>
    );
};

export default Logo;
