import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ className = '', size = 'md', showTagline = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-sm'
  };

  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`}>
      {/* Logo Mark */}
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 relative">
          {/* Diamond shape */}
          <div className="absolute inset-0 rotate-45 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-sm" />
          {/* Inner accent */}
          <div className="absolute inset-2 rotate-45 border border-primary-foreground/30 rounded-sm" />
          {/* P letter */}
          <span className="absolute inset-0 flex items-center justify-center font-display text-primary-foreground font-bold text-lg md:text-xl">
            P
          </span>
        </div>
      </motion.div>

      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-display font-semibold tracking-wider ${sizeClasses[size]}`}>
          <span className="text-primary">PRO</span>
          <span className="text-foreground">BAGNO</span>
        </span>
        {showTagline && (
          <span className={`${taglineSizes[size]} tracking-[0.3em] text-muted-foreground uppercase`}>
            Depuis 1974
          </span>
        )}
      </div>
    </Link>
  );
}
